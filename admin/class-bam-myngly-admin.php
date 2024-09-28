<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/admin
 * @author     Your Name <email@example.com>
 */
class Bam_Myngly_Admin
{

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $bam_myngly    The ID of this plugin.
	 */
	private $bam_myngly;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $bam_myngly       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($bam_myngly, $version)
	{

		$this->bam_myngly = $bam_myngly;
		$this->version = $version;
		add_action('admin_menu', [$this, 'bam_myngly_admin_menu']);
		add_action('admin_init', [$this, 'bam_myngly_register_settings']);
	}



	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles()
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Plugin_Name_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Plugin_Name_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style($this->bam_myngly, plugin_dir_url(__FILE__) . 'css/bam-myngly-admin.css', array(), $this->version, 'all');
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts()
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Plugin_Name_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Plugin_Name_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script($this->bam_myngly, plugin_dir_url(__FILE__) . 'js/bam-myngly-admin.js', array('jquery'), $this->version, false);
	}

	public function bam_myngly_admin_menu()
	{
		add_menu_page(
			'Myngly Settings',   // Page title
			'Myngly Settings',   // Menu title
			'manage_options',    // Capability
			'bam-myngly-settings',  // Menu slug
			[$this, 'bam_myngly_settings_page'],  // Callback to display content
			'dashicons-admin-generic',  // Icon
			110  // Position in the menu
		);
	}

	public function bam_myngly_settings_page()
	{
?>
		<div class="wrap">
			<h1>Myngly API Settings</h1>
			<form method="post" action="options.php">
				<?php
				settings_fields('bam-myngly-settings-group');
				do_settings_sections('bam-myngly-settings');
				submit_button();
				?>
			</form>
		</div>
<?php
	}

	public function bam_myngly_register_settings()
	{
		register_setting('bam-myngly-settings-group', 'bam_myngly_api_url');
		register_setting('bam-myngly-settings-group', 'bam_myngly_api_token');
		register_setting('bam-myngly-settings-group', 'bam_myngly_linkedin_client_id');
		register_setting('bam-myngly-settings-group', 'bam_myngly_linkedin_client_secret');


		add_settings_section(
			'bam_myngly_section',
			'API Configuration',
			null,
			'bam-myngly-settings'
		);

		add_settings_field(
			'bam_myngly_api_url',
			'API URL',
			[$this, 'bam_myngly_api_url_field'],
			'bam-myngly-settings',
			'bam_myngly_section'
		);

		add_settings_field(
			'bam_myngly_api_token',
			'API Token',
			[$this, 'bam_myngly_api_token_field'],
			'bam-myngly-settings',
			'bam_myngly_section'
		);

		add_settings_field(
			'bam_myngly_linkedin_client_id',
			'LinkedIn Client ID',
			[$this, 'bam_myngly_linkedin_client_id_field'],
			'bam-myngly-settings',
			'bam_myngly_section'
		);

		add_settings_field(
			'bam_myngly_linkedin_client_secret',
			'LinkedIn Client Secret',
			[$this, 'bam_myngly_linkedin_client_secret_field'],
			'bam-myngly-settings',
			'bam_myngly_section'
		);
	}

	public function bam_myngly_api_url_field()
	{
		$value = esc_url(get_option('bam_myngly_api_url', ''));
		echo '<input type="url" name="bam_myngly_api_url" value="' . $value . '" class="regular-text">';
	}

	public function bam_myngly_api_token_field()
	{
		$value = esc_attr(get_option('bam_myngly_api_token', ''));
		echo '<input type="text" name="bam_myngly_api_token" value="' . $value . '" class="regular-text">';
	}

	public function bam_myngly_linkedin_client_id_field()
	{
		$value = esc_attr(get_option('bam_myngly_linkedin_client_id', ''));
		echo '<input type="text" name="bam_myngly_linkedin_client_id" value="' . $value . '" class="regular-text">';
	}

	public function bam_myngly_linkedin_client_secret_field()
	{
		$value = esc_attr(get_option('bam_myngly_linkedin_client_secret', ''));
		echo '<input type="text" name="bam_myngly_linkedin_client_secret" value="' . $value . '" class="regular-text">';
	}
}
