(function($) {
    'use strict';

    // Local storage for data
    let educationLevels = [];
    let phoneCodes = [];

    // Generic function to initialize Select2 with backend search
    function initSelect2WithBackendSearch(selector, endpoint, searchKey = 'search', idKey = 'id', textKey = 'name', placeholder, multiple = false, maxSelectionLength = null) {
        $(selector).select2({
            placeholder: placeholder || $(selector).data('placeholder'),
            width: '100%',
            multiple: multiple, // Allow multiple selections if true
            maximumSelectionLength: maxSelectionLength, // Limit selection if provided
            ajax: {
                url: function(params) {
                    return `${apiConfig.apiBaseUrl}${endpoint}?${searchKey}=${params.term || ''}`;
                },
                delay: 250,
                processResults: function(data) {
                    return {
                        results: data.data.map(function(item) {
							let itemKey = item[idKey];
                            if (selector === '#from' || selector === '#lives_in') {
								itemKey = item.name + ', ' + item.state_iso_code;
							}
                            return {
                                id: itemKey,
                                text: item[textKey]
                            };
                        })
                    };
                },
                cache: true
            },
            minimumInputLength: 0,
            allowClear: true,
            dropdownAutoWidth: true // Ensure dropdown fits the width of the container
        });
    }

    // Initialize Select2 with local search
    function initSelect2WithLocalSearch(selector, data, placeholder) {
        $(selector).select2({
            placeholder: placeholder || 'Select an option...',
            width: '100%',
            data: data,
            allowClear: true,
            minimumInputLength: 0
        });
    }

    // Function to fetch education levels from API
    function fetchEducationLevels() {
        return fetch(`${apiConfig.apiBaseUrl}/api/typ/list-education-levels`)
            .then(response => response.json())
            .then(data => {
                educationLevels = data.data.map(item => ({
                    id: item.id,
                    text: item.name || item.text
                }));
                return educationLevels;
            })
            .catch(error => console.error('Error fetching education levels:', error));
    }

    // Function to fetch phone codes from API
    function fetchPhoneCodes() {
        return fetch(`${apiConfig.apiBaseUrl}/api/typ/countries/phone-codes`)
            .then(response => response.json())
            .then(data => {
                phoneCodes = Object.keys(data.data).map(code => ({
                    id: code,
                    text: data.data[code]
                }));
                return phoneCodes;
            })
            .catch(error => console.error('Error fetching phone codes:', error));
    }

    // Initialize all Select2 fields
    function initializeSelect2Fields() {
        // Fields with local search
        $('[data-endpoint2]').each(function() {
            const endpoint = $(this).data('endpoint2');
            if (endpoint === '/api/typ/list-education-levels') {
                fetchEducationLevels().then(data => initSelect2WithLocalSearch(this, data));
            } else if (endpoint === '/api/typ/countries/phone-codes') {
                fetchPhoneCodes().then(data => initSelect2WithLocalSearch(this, data));
            }
        });

        // Initialize Select2 fields with backend search
        initSelect2WithBackendSearch('#passions', '/api/typ/list-passions', 'search', 'id', 'name', 'Search and select up to 5 passions...', true, 5);
        initSelect2WithBackendSearch('#current_goals', '/api/typ/list-current-goals', 'search', 'id', 'name', 'Search and select one or more current goals...', true);
        initSelect2WithBackendSearch('#education_level', '/api/typ/list-education-levels', 'search', 'name', 'name', 'Search and select your education level...', false);
        initSelect2WithBackendSearch('#industry', '/api/typ/list-industry', 'search', 'id', 'name', 'Search and select industries...', true);
        initSelect2WithBackendSearch('#years_of_experience', '/api/typ/list-years-of-experience', 'search', 'id', 'name', 'Search and select your experience level...', false);
        initSelect2WithBackendSearch('#job_title', '/api/typ/list-jobs', 'search', 'name', 'name', 'Search and select your job title...', false);
        //initSelect2WithBackendSearch('#company', '/api/companies/search', 'query', 'name', 'name', 'Search and select your company...', false);
        initSelect2WithBackendSearch('#lives_in', '/api/typ/list-cities', 'search', 'name', 'name', 'Select your city...', false);
        initSelect2WithBackendSearch('#from', '/api/typ/list-cities', 'search', 'name', 'name', 'Select your city of origin...', false);
        initSelect2WithBackendSearch('#education', '/api/typ/list-universities', 'search', 'name', 'name', 'Select your university...', false);
        initSelect2WithBackendSearch('#list_ids', '/api/typ/constant-contact/list', 'search', 'id', 'name', 'Click here...', true);


    }

    // Initialize LinkedIn Connect button functionality
    function initLinkedInConnect() {
        $('#linkedin-connect').on('click', function(e) {
            e.preventDefault();
            const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${apiConfig.linkedinClientId}&redirect_uri=${encodeURIComponent(apiConfig.linkedinRedirectUri)}&state=${apiConfig.linkedinState}&scope=openid%20profile%20email`;

            const loginWindow = window.open(linkedInAuthUrl, 'LinkedIn Login', 'width=600,height=600');
            const pollTimer = setInterval(() => {
                if (loginWindow.closed) {
                    clearInterval(pollTimer);
                }
            }, 500);
        });
    }


    // Handle form submission
    function handleFormSubmission() {
        $('#myngly-form').on('submit', function (e) {
            e.preventDefault();
            const phoneCode = $('#phone_code').val();
            const phoneNumber = $('#phone_number').val();
            const fullPhoneNumber = phoneCode + phoneNumber;
            const passions = $('#passions').val();
            const currentGoals = $('#current_goals').val();
            const educationLevel = $('#education_level').val();
            const industries = $('#industry').val();
            const yearsOfExperience = $('#years_of_experience').val();
            const combinedFilterIds = currentGoals.concat(educationLevel, industries, yearsOfExperience);
    
            if (passions.length !== 5) {
                alert("Please select exactly 5 passions.");
                return;
            }
    
            // Show loading message while verifying the data
            Swal.fire(
                { 
                    title: 'Sending code...', 
                    text: 'Please wait while we send the code to your phone: '+fullPhoneNumber, 
                    allowOutsideClick: false, 
                    didOpen: () => Swal.showLoading()
                });
    
            fetch(`${apiConfig.apiBaseUrl}/api/typ/sendcode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: fullPhoneNumber })
            })
                .then(response => response.json())
                .then(() => {
                    Swal.close();
                    Swal.fire({
                        title: 'Enter the verification code sent to ' + fullPhoneNumber,
                        input: 'tel',
                        inputAttributes: { maxlength: 6, inputmode: 'numeric' },
                        showCancelButton: true,
                        didOpen: () => {
                            const input = Swal.getInput();
                            input.addEventListener('input', () => {
                                if (input.value.length === 6) {
                                    Swal.clickConfirm();
                                }
                            });
                        },
                        preConfirm: (code) => submitFormData(code, fullPhoneNumber, combinedFilterIds)
                    });
                })
                .catch(error => Swal.fire({ title: 'Error!', text: 'Failed to send verification code!', icon: 'error' }));
        });
    }
    // Function to submit form data
    function submitFormData(code, phoneNumber, combinedFilterIds) {
        const linkedinProfileValue = $('#linkedin-profile').val();

        let linkedinProfile = {};

        // Attempt to parse LinkedIn profile if it's a string
        if (typeof linkedinProfileValue === 'string') {
            try {
                linkedinProfile = JSON.parse(linkedinProfileValue);
            } catch (error) {
                console.error('Error parsing LinkedIn profile JSON', error);
            }
        } else if (typeof linkedinProfileValue === 'object') {
            linkedinProfile = linkedinProfileValue;
        }

        const formData = {
            code: code,
            name: $('#name').val(),
            email: $('#email').val(),
            phone_number: phoneNumber,
            birthday_at: $('#birthday_at').val(),
            gender: $('#gender').val(),
            passions: Array.from(passions.selectedOptions).map(option => option.value),
            linkedin_url: $('#linkedin_url').val(),
            image_url: $('#image_url').val(),
            filter_id: combinedFilterIds,
            about_me: $('#about_me').val(),
            lives_in: $('#lives_in').val(),
            from: $('#from').val(),
            job_titles: $('#job_title').val(),
            company: $('#company').val(),
            education: $('#education').val(),
            military_veteran: $('#military_veteran').val(),
            receive_news: $('#receive_news').val(),
            list_ids: $('#list_ids').val(),
            linkedin: linkedinProfile,
        };

        // Show loading message while processing registration
        Swal.fire({
            title: 'Please wait...',
            text: 'We are verifying your data. This may take a moment.',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        // Make the API request to register the form data
        return fetch(`${apiConfig.apiBaseUrl}/api/typ/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(() => {
                // Close loading message
                Swal.close();

                // Show success message
                Swal.fire({
                    title: 'Success!',
                    text: 'Registered successfully!',
                    icon: 'success',willClose: () => {
                        $('#myngly-form').trigger("reset");
                    }
                });
                //reload the page
                location.reload();
            })
            .catch(error => {
                // Show validation error message if the request fails
                Swal.showValidationMessage(`Request failed: ${error}`);
            });
    }


    // Initialization
    $(document).ready(function() {
        initializeSelect2Fields();
        initLinkedInConnect();
        handleFormSubmission();
    });

})(jQuery);
