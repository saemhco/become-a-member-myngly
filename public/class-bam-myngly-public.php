<?php

class Bam_Myngly_Public
{
	/**
	 * The ID of this plugin.
	 * @since 1.0.0
	 * @access private
	 * @var string $bam_myngly The ID of this plugin.
	 */
	private $bam_myngly;

	/**
	 * The version of this plugin.
	 * @since 1.0.0
	 * @access private
	 * @var string $version The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 * @since 1.0.0
	 * @param string $bam_myngly The name of the plugin.
	 * @param string $version The version of this plugin.
	 */
	public function __construct($bam_myngly, $version)
	{
		$this->bam_myngly = $bam_myngly;
		$this->version = $version;

		// Register shortcode for the form
		add_action('init', [$this, 'register_shortcode']);
		// Register LinkedIn callback handling
		add_action('init', [$this, 'linkedin_callback_route']);
		add_filter('query_vars', [$this, 'add_query_vars']);
		add_action('template_redirect', [$this, 'handle_linkedin_callback']);
		add_action('wp_ajax_upload_temp_file', array($this, 'handle_temp_file_upload'));
		add_action('wp_ajax_nopriv_upload_temp_file', array($this, 'handle_temp_file_upload'));
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 * @since 1.0.0
	 */
	public function enqueue_styles()
	{
		wp_enqueue_style('bootstrap-css', 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');
		wp_enqueue_style('select2-css', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css');
		wp_enqueue_style($this->bam_myngly, plugin_dir_url(__FILE__) . 'css/bam-myngly-public.css', array(), $this->version, 'all');
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 * @since 1.0.0
	 */
	public function enqueue_scripts()
	{
		wp_enqueue_script('popper-js', 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js', array('jquery'), null, true);
		wp_enqueue_script('bootstrap-js', 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js', array('jquery'), null, true);
		wp_enqueue_script('sweetalert-js', 'https://cdn.jsdelivr.net/npm/sweetalert2@11', array('jquery'), null, true);
		wp_enqueue_script('select2-js', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js', array('jquery'), null, true);
		wp_enqueue_script($this->bam_myngly, plugin_dir_url(__FILE__) . 'js/bam-myngly-public.js', array('jquery'), $this->version, true);

		// Pass API data and LinkedIn credentials to the JavaScript file
		wp_localize_script($this->bam_myngly, 'apiConfig', array(
			'apiBaseUrl' => esc_url(get_option('bam_myngly_api_url', 'http://127.0.0.1:8000')),
			'linkedinClientId' => esc_attr(get_option('bam_myngly_linkedin_client_id')),
			'linkedinRedirectUri' => esc_url(home_url('/linkedin-callback')),
			'linkedinState' => wp_create_nonce('linkedin_oauth_state'),
			'linkedinAccessToken' => isset($_SESSION['linkedin_access_token']) ? $_SESSION['linkedin_access_token'] : '', // Pass the token to JavaScript
			'uploadUrl' => admin_url('admin-ajax.php'),
			'authToken' => wp_create_nonce('wp_rest')
		));
	}

	/**
	 * Create the LinkedIn callback route
	 */
	public function linkedin_callback_route()
	{
		add_rewrite_rule('^linkedin-callback/?', 'index.php?linkedin_callback=1', 'top');
	}

	/**
	 * Add query var for LinkedIn callback
	 */
	public function add_query_vars($vars)
	{
		$vars[] = 'linkedin_callback';
		return $vars;
	}

	/**
	 * Handle the LinkedIn callback and obtain user profile data.
	 */
	public function handle_linkedin_callback()
	{
		if (isset($_GET['code']) && isset($_GET['state']) && wp_verify_nonce($_GET['state'], 'linkedin_oauth_state')) {
			$code = sanitize_text_field($_GET['code']);
			$client_id = esc_attr(get_option('bam_myngly_linkedin_client_id'));
			$client_secret = esc_attr(get_option('bam_myngly_linkedin_client_secret'));
			$redirect_uri = esc_url(home_url('/linkedin-callback'));

			$response = wp_remote_post('https://www.linkedin.com/oauth/v2/accessToken', array(
				'body' => array(
					'grant_type' => 'authorization_code',
					'code' => $code,
					'redirect_uri' => $redirect_uri,
					'client_id' => $client_id,
					'client_secret' => $client_secret
				)
			));

			if (!is_wp_error($response)) {
				$body = json_decode(wp_remote_retrieve_body($response), true);

				if (isset($body['access_token'])) {
					$access_token = $body['access_token'];

					$profile_response = wp_remote_get('https://api.linkedin.com/v2/userinfo', array(
						'headers' => array('Authorization' => 'Bearer ' . $access_token)
					));

					if (!is_wp_error($profile_response)) {
						$profile = json_decode(wp_remote_retrieve_body($profile_response), true);

						$picture_response = wp_remote_get('https://api.linkedin.com/v2/me?projection=(profilePicture(displayImage~:playableStreams))', array(
							'headers' => array('Authorization' => 'Bearer ' . $access_token)
						));

						$picture_url = '';
						if (!is_wp_error($picture_response)) {
							$picture_data = json_decode(wp_remote_retrieve_body($picture_response), true);
							if (isset($picture_data['profilePicture']['displayImage~']['elements'])) {
								$elements = $picture_data['profilePicture']['displayImage~']['elements'];
								$largest_image = end($elements);
								$picture_url = $largest_image['identifiers'][0]['identifier'];
							}
						}

						$name_parts = explode(' ', $profile['name'], 2);
						$name = $name_parts[0];
						$last_name = isset($name_parts[1]) ? $name_parts[1] : '';

						echo "<script>
							window.opener.document.getElementById('name').value = '" . addslashes($name) . "';
							window.opener.document.getElementById('last_name').value = '" . addslashes($last_name) . "';
							window.opener.document.getElementById('email').value = '{$profile['email']}';
							window.opener.document.getElementById('profile-photo').src = '{$picture_url}';
							window.opener.document.getElementById('image_url').value = '{$picture_url}';
							window.opener.document.getElementById('linkedin-user-id').value = '{$profile['sub']}';
							window.close();
						</script>";
					} else {
						echo 'Error fetching LinkedIn profile data';
					}
				}
			}
		}
	}

	public function handle_temp_file_upload()
	{
		check_ajax_referer('wp_rest', 'security');

		if (!function_exists('wp_handle_upload')) {
			require_once(ABSPATH . 'wp-admin/includes/file.php');
		}

		$uploadedfile = $_FILES['file'];
		$upload_overrides = array('test_form' => false);

		$upload_dir = plugin_dir_path(__FILE__) . 'partials/assets/images/temp/';
		if (!file_exists($upload_dir)) {
			wp_mkdir_p($upload_dir);
		}
		$filename = wp_unique_filename($upload_dir, $uploadedfile['name']);
		$uploadfile_path = $upload_dir . $filename;

		if (move_uploaded_file($uploadedfile['tmp_name'], $uploadfile_path)) {
			$image_url = plugin_dir_url(__FILE__) . 'partials/assets/images/temp/' . $filename;
			wp_send_json_success(array('url' => $image_url));
		} else {
			wp_send_json_error(array('message' => 'Failed to upload file.'));
		}
	}

	/**
	 * Create the form via shortcode.
	 * @since 1.0.0
	 * @return string The form HTML output.
	 */
	public function bam_myngly_form_shortcode()
	{
		ob_start();
		// Load the HTML from the separate file
		include plugin_dir_path(__FILE__) . 'partials/form-myngly.php';
		return ob_get_clean();
	}

	/**
	 * Register the shortcode for the form.
	 * @since 1.0.0
	 */
	public function register_shortcode()
	{
		add_shortcode('myngly_form', [$this, 'bam_myngly_form_shortcode']);
	}
}
