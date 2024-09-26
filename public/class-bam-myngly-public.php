<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Plugin_Name
 * @subpackage Plugin_Name/public
 * @author     Your Name <email@example.com>
 */
class Bam_Myngly_Public
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
	 * @param      string    $bam_myngly       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($bam_myngly, $version)
	{
		$this->bam_myngly = $bam_myngly;
		$this->version = $version;

		// Register shortcode for the form
		add_action('init', [$this, 'register_shortcode']);
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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
		wp_enqueue_style('bootstrap-css', 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css');
		wp_enqueue_style('select2-css', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css');
		wp_enqueue_style($this->bam_myngly, plugin_dir_url(__FILE__) . 'css/bam-myngly-public.css', array(), $this->version, 'all');
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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
		wp_enqueue_script('bootstrap-js', 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js', array('jquery'), null, true);
		wp_enqueue_script('sweetalert-js', 'https://cdn.jsdelivr.net/npm/sweetalert2@11', array('jquery'), null, true);
		wp_enqueue_script('select2-js', 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js', array('jquery'), null, true);
		wp_enqueue_script($this->bam_myngly, plugin_dir_url(__FILE__) . 'js/bam-myngly-public.js', array('jquery'), $this->version, true);
		wp_localize_script($this->bam_myngly, 'apiConfig', array(
			'apiBaseUrl' => esc_url(get_option('bam_myngly_api_url', 'http://127.0.0.1:8000'))
		));
	}

	/**
	 * Create the form via shortcode.
	 *
	 * This method will output the HTML form when the shortcode [myngly_form] is used.
	 *
	 * @since    1.0.0
	 * @return   string    The form HTML output.
	 */
	public function bam_myngly_form_shortcode()
	{
		ob_start();
		// Cargar el HTML desde el archivo separado
		include plugin_dir_path(__FILE__) . 'partials/form-myngly.php';
		return ob_get_clean();
	}


	/**
	 * Register the shortcode for the form.
	 *
	 * This method links the shortcode [myngly_form] to the bam_myngly_form_shortcode method.
	 *
	 * @since    1.0.0
	 */
	public function register_shortcode()
	{
		add_shortcode('myngly_form', [$this, 'bam_myngly_form_shortcode']);
	}
}
