(function($) {
    'use strict';

    // Local storage for data
    const defaultImageUrl = $('#profile-photo').attr('src'); 
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
    function initSelect2WithLocalSearch(selector, data, placeholder=null, keyId='id', keyText='name') {
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

    function fetchLocalSearch(url) {
        return fetch(`${apiConfig.apiBaseUrl + url}`)
            .then(response => response.json())
            .then(data => {
                const result = data.data.map(item => {
                    return {
                        id: item.id,
                        text: url.includes('/api/typ/list-current-goals') ? item.nameforme : (item.name || item.text)
                    };
                });
                return result;
            })
            .catch(error => console.log('Error fetching data:', error));
    }
    

    // Initialize all Select2 fields
    function initializeSelect2Fields() {
        // Fields with local search
        $('[data-endpoint2]').each(function() {
            const endpoint = $(this).data('endpoint2');
            if (endpoint === '/api/typ/list-education-levels') {
                // console.log('Fetching education levels...', data);
                fetchEducationLevels().then(data => initSelect2WithLocalSearch(this, data));
            } else if (endpoint === '/api/typ/countries/phone-codes') {
                fetchPhoneCodes().then(data => initSelect2WithLocalSearch(this, data));
            } else if (endpoint === '/api/typ/list-years-of-experience') {
                fetchLocalSearch(endpoint).then(data => initSelect2WithLocalSearch(this, data));
            } else if (endpoint === '/api/typ/list-industry') {
                fetchLocalSearch(endpoint).then(data => initSelect2WithLocalSearch(this, data, "Search and select industries..."));
            } else if (endpoint === '/api/typ/list-current-goals') {
                fetchLocalSearch(endpoint).then(data => initSelect2WithLocalSearch(this, data, "Search and select one or more current goals..."));
            } else if (endpoint === '/api/typ/constant-contact/list') {
                fetchLocalSearch(endpoint).then(data => initSelect2WithLocalSearch(this, data, "Search and select one or more..."));
            }
        });

        // Initialize Select2 fields with backend search
        initSelect2WithBackendSearch('#passions', '/api/typ/list-passions', 'search', 'id', 'name', 'Search and select up to 5 passions...', true, 5);
        initSelect2WithBackendSearch('#current_goals', '/api/typ/list-current-goals', 'search', 'id', 'nameforme', 'Search and select one or more current goals...', true);
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
        $('#connect-linkedin').on('click', function(e) {
            e.preventDefault();
            const linkedInAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${encodeURIComponent(apiConfig.linkedinClientId)}&redirect_uri=${encodeURIComponent(apiConfig.linkedinRedirectUri)}&state=${encodeURIComponent(apiConfig.linkedinState)}&scope=${encodeURIComponent('openid profile email r_liteprofile')}`;
            const loginWindow = window.open(linkedInAuthUrl, 'LinkedIn Login', 'width=600,height=600');
            const pollTimer = setInterval(() => {
                if (loginWindow.closed) {
                    clearInterval(pollTimer);
                }
            }, 500);
        });
    }

    function handleFileUpload() {
        $('#upload-from-device').on('click', function(e) {
            e.preventDefault();
            $('#file-upload').trigger('click'); 
        });
    
        $('#file-upload').on('change', function() {
            const file = this.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('action', 'upload_temp_file'); 
                formData.append('security', apiConfig.authToken); 
    
                $.ajax({
                    url: apiConfig.uploadUrl,
                    method: 'POST',
                    processData: false,
                    contentType: false,
                    data: formData,
                    success: function(response) {
                        if (response.success) {
                            const imageUrl = response.data.url;
                            $('#profile-photo').attr('src', imageUrl); 
                            $('#image_url').val(imageUrl); 
                        } else {
                            console.error('Upload failed:', response);
                            Swal.fire({
                            icon: 'warning',
                            title: 'Upload Error',
                            text: 'There was an error uploading the file. Please try again.',
                            confirmButtonText: 'Ok'
                        });
                        }
                    },
                    error: function(error) {
                        console.error('Request failed:', error);
                        Swal.fire({
                            icon: 'warning',
                            title: 'Upload Error',
                            text: 'There was an error uploading the file. Please try again.',
                            confirmButtonText: 'Ok'
                        });
                    }
                });
            }
        });
    }
    


    // Handle form submission
    function handleFormSubmission() {
        $('#myngly-form').on('submit', function (e) {
            e.preventDefault(); // Prevent the default form submission behavior
    
            const currentImageUrl = $('#profile-photo').attr('src');
            // Check if the profile photo is missing
            if (currentImageUrl === defaultImageUrl) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Profile Photo Missing',
                    text: 'Please upload a profile photo before submitting the form.',
                    confirmButtonText: 'Ok',
                    customClass: {
                        confirmButton: 'custom-swal-button'
                    },
                    buttonsStyling: false
                }).then(() => {
                    const uploadButton = document.getElementById('uploadPhotoButton');
                    const submitButton = document.querySelector('button[type="submit"]');
            
                    if (submitButton) {
                        // Temporarily disable the submit button
                        submitButton.disabled = true;
                    }
            
                    if (uploadButton) {
                        const formGroup = uploadButton.closest('.form-group'); // Locate the form group containing the button
            
                        if (formGroup) {
                            formGroup.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center' // Center the upload button in the viewport
                            });
                        }
            
                        uploadButton.classList.add('highlight'); // Highlight the button
                        $('#uploadPhotoButton').dropdown('toggle'); // Open the dropdown menu
            
                        setTimeout(() => {
                            uploadButton.classList.remove('highlight'); // Remove highlight after 2 seconds
                            uploadButton.focus(); // Keep focus on the upload button
                        }, 2000);
                    }
            
                    // Re-enable the submit button after a delay to ensure proper focus
                    setTimeout(() => {
                        if (submitButton) {
                            submitButton.disabled = false;
                        }
                    }, 2500);
                });
            
                // Ensure the submit button loses focus immediately
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.blur(); // Remove focus from the submit button
                }
            
                return; // Stop further execution
            }                       
    
            const phoneCode = $('#phone_code').val();
            const phoneNumber = $('#phone_number').val();
            const fullPhoneNumber = phoneCode + phoneNumber;
            const passions = $('#passions').val();
            const currentGoals = $('#current_goals').val();
            const educationLevel = $('#education_level').val();
            const industries = $('#industry').val();
            const yearsOfExperience = $('#years_of_experience').val();
            const combinedFilterIds = currentGoals.concat(educationLevel, industries, yearsOfExperience);
    
            // Validate passions input
            if (passions.length < 5) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Action Required',
                    text: 'Please select at least 5 passions.',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    $('#passions').addClass('highlight');
                    $('html, body').animate({
                        scrollTop: $('#passions').offset().top - ($(window).height() / 2) + ($('#passions').outerHeight() / 2)
                    }, 500, () => {
                        $('#passions').select2('open'); // Open the Select2 dropdown
                    });
    
                    setTimeout(() => {
                        $('#passions').removeClass('highlight'); // Remove the highlight
                    }, 2000);
                });
    
                return;
            }
    
            // Show a loading message while verifying the data
            Swal.fire({
                title: 'Sending code...',
                text: `Please wait while we send the code to your phone: ${fullPhoneNumber}`,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
    
            // Make an API call to send the code
            fetch(`${apiConfig.apiBaseUrl}/api/typ/sendcode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone_number: fullPhoneNumber, email: $('#email').val() })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.code === 100) {
                        if (data.errors?.phone_number) {
                            Swal.fire({
                                imageUrl: apiConfig.pluginUrl + 'partials/assets/images/img-alert.png',
                                imageHeight: 100,
                                imageAlt: 'Alert icon',
                                html: `
                                    <div style="text-align: center;">
                                        <div style="font-size: 1rem; font-weight: bold; margin-bottom: 10px;">Action required to proceed</div>
                                        <div style="font-size: 1.5rem; font-weight: bold; color: #333; margin-bottom: 20px;">Phone number already registered</div>
                                        <div style="line-height: 1.5; color: #555; font-size: 0.9rem;">
                                            <p>
                                                This phone number is already associated with an existing Myngly account. <br>
                                                Please go to the Myngly login screen and select <i>'I have an account'</i>. <br>
                                                Use this phone number to access your account.
                                            </p>
                                            <p style="margin-top: 20px;">
                                                Don't have the app? 
                                                <a href="https://apps.apple.com/us/app/myngly-business-networking/id6444663286" 
                                                target="_blank" 
                                                style="color: #007bff; text-decoration: underline; font-style: italic;">
                                                Download Myngly on the App Store
                                                </a>.
                                            </p>
                                            <p>
                                                Need help? 
                                                <a href="https://texasyoungprofessionals.com/contact" 
                                                target="_blank" 
                                                style="color: #007bff; text-decoration: underline; font-style: italic;">
                                                Contact us
                                                </a>.
                                            </p>
                                        </div>
                                    </div>
                                `,
                                confirmButtonText: '<strong>Edit Phone Number</strong>',
                                customClass: {
                                    confirmButton: 'custom-swal-button'
                                },
                                buttonsStyling: false
                            }).then(() => {
                                const phoneNumberInput = document.getElementById('phone_number');
                                if (phoneNumberInput) {
                                    phoneNumberInput.value = ''; // Clear the input
                                    phoneNumberInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    setTimeout(() => {
                                        phoneNumberInput.focus(); // Focus the input
                                    }, 300);
                                }
                            });

                            return;
                        }

                        if (data.errors?.email) {
                            Swal.fire({
                                imageUrl: apiConfig.pluginUrl + 'partials/assets/images/img-alert.png',
                                imageHeight: 100,
                                imageAlt: 'Email Alert Icon',
                                html: `
                                    <div style="text-align: center;">
                                        <div style="font-size: 1rem; font-weight: bold; margin-bottom: 10px;">Action required to proceed</div>
                                        <div style="font-size: 1.5rem; font-weight: bold; color: #333; margin-bottom: 20px;">Email already registered</div>
                                        <div style="line-height: 1.5; color: #555; font-size: 0.9rem;">
                                            <p>
                                                This email is already associated with an existing Myngly account. <br>
                                                Please double-check your inputs or go to the Myngly login screen and select <strong><i>'I have an account'</i></strong> to sign in using this email.
                                            </p>
                                            <p style="margin-top: 20px;">
                                                Don't have the app? 
                                                <a href="https://apps.apple.com/us/app/myngly-business-networking/id6444663286" 
                                                target="_blank" 
                                                style="color: #007bff; text-decoration: underline; font-style: italic;">
                                                Download Myngly on the App Store
                                                </a>.
                                            </p>
                                            <p>
                                                Need help? 
                                                <a href="https://texasyoungprofessionals.com/contact/" 
                                                target="_blank" 
                                                style="color: #007bff; text-decoration: underline; font-style: italic;">
                                                Contact us
                                                </a>.
                                            </p>
                                        </div>
                                    </div>
                                `,
                                confirmButtonText: '<strong>Edit Email</strong>',
                                customClass: {
                                    confirmButton: 'custom-swal-button'
                                },
                                buttonsStyling: false
                            }).then(() => {
                                const emailInput = document.getElementById('email');
                                if (emailInput) {
                                    emailInput.value = ''; // Clear the email input
                                    emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    setTimeout(() => {
                                        emailInput.focus(); // Focus the email input
                                    }, 300);
                                }
                            });
                            return;
                        }
                    }

                    Swal.close();
                    Swal.fire({
                        title: `Enter the verification code sent to ${fullPhoneNumber}`,
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
                .catch(() => Swal.fire({ title: 'Error!', text: 'Failed to send verification code!', icon: 'error' }));
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
            last_name: $('#last_name').val(),
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
            .then((data) => {
                // Close loading message
                Swal.close();
                if (data.code === 100) {
                    let errorMessages = '';                
                    if (data.errors) {
                        for (const field in data.errors) {
                            if(field === 'email'){
                                Swal.fire({
                                    icon: 'warning', 
                                    title: 'Action Required',
                                    text: "This email is already linked to an existing account. Please double check your inputs or go to Myngly app login screen and select ‘I HAVE AN ACCOUNT’ to sign in.", 
                                    confirmButtonText: 'Ok'
                                });
                                return;
                            }
                            else if(field === 'phone_number'){
                                Swal.fire({
                                    icon: 'error', // Cambiar el ícono
                                    title: 'Action required to proceed',
                                    html: `
                                        <p><strong>Phone number already registered</strong></p>
                                        <p>This phone number is already associated with an existing Myngly account. Please go to the Myngly login screen and select <strong><i>'I have an account'</i></strong>. Use this phone number to access your account.</p>
                                        <p>Don't have the app? <a href="https://apps.apple.com/us/app/myngly-business-networking/id6444663286" target="_blank" style="color: #007bff; text-decoration: underline;">Download Myngly on the App Store</a>.</p>
                                        <p>Need help? <a href="https://myngly.com/contact-us" target="_blank" style="color: #007bff; text-decoration: underline;">Contact us</a>.</p>
                                    `,
                                    confirmButtonText: '<strong>Edit Phone Number</strong>',
                                    confirmButtonColor: '#004085'
                                });
                                return;
                            }
                            if (data.errors.hasOwnProperty(field)) {
                                data.errors[field].forEach(message => {
                                    errorMessages += `${message}\n`;
                                });
                            }
                        }
                    }
                
                    Swal.fire({
                        icon: 'warning',
                        title: 'Processing Error',
                        text: `${data.message}\n${errorMessages}`,
                        confirmButtonText: 'Ok'
                    });
                    return;
                }                
                else {
                    // Show success message
                    Swal.fire({
                        imageUrl: apiConfig.pluginUrl + 'partials/assets/images/img-success.png',
                        imageHeight: 100,
                        imageAlt: 'Success Icon',
                        html: `
                            <div style="text-align: center;">
                                <div style="font-size: 1.5rem; font-weight: bold; margin-bottom: 10px;">Success!</div>
                                <div style="font-size: 1.2rem; font-weight: bold; color: #333; margin-bottom: 20px;">Your application is submitted.</div>
                                <div style="line-height: 1.5; color: #555; font-size: 0.9rem;">
                                    <p>
                                        We’ve received your application and will review it shortly. <br>
                                        You’ll be notified about the status of your application via email.
                                    </p>
                                    <p style="margin-top: 20px;">
                                        For faster review, you can add more details to your application by downloading Myngly from the App Store
                                        <a href="https://apps.apple.com/us/app/myngly-business-networking/id6444663286" 
                                           target="_blank" 
                                           style="color: #000000; text-decoration: underline; font-style: italic;"> here 
                                        </a>. 
                                        Select "I have an account" and log in using the same email address you provided on this form.
                                    </p>
                                    <p>
                                        Your application via email from team@myngly.info. Be sure to add this email to the safe senders list.
                                    </p>
                                </div>
                            </div>
                        `,
                        confirmButtonText: 'Got it!',
                        customClass: {
                            confirmButton: 'custom-swal-button'
                        },
                        buttonsStyling: false,
                        willClose: () => {
                            // Reload the page after the modal closes
                            location.reload();
                        }
                    });
                }                              
            })
            .catch(error => {
                console.error('Request failed:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Technical Issues',
                    text: 'We are experiencing technical difficulties. Please try again later.',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        // hide the loading message
                        Swal.close();
                    }
                });
            });
            
    }


    // Initialization
    $(document).ready(function() {
        initializeSelect2Fields();
        initLinkedInConnect();
        handleFileUpload();
        handleFormSubmission();
    });

})(jQuery);
