(function($) {
    'use strict';

	// Fetch country codes from the API
    fetch(apiConfig.apiBaseUrl + '/api/typ/countries/phone-codes')
        .then(response => response.json())
        .then(data => {
            const phoneCodeSelect = document.getElementById('phone_code');
            Object.keys(data.data).forEach(code => {
                const option = document.createElement('option');
                option.value = code;
                option.text = data.data[code];
                phoneCodeSelect.appendChild(option);
            });
        });

    // Initialize Select2 for "Lives In" and "From" fields
    $('#lives_in, #from').select2({
        placeholder: 'Search for a city...',
        width: 'resolve',  // Adjust width to match the form control
        ajax: {
            url: function(params) {
                return `${apiConfig.apiBaseUrl}/api/typ/list-cities?search=${params.term || ''}`;  // Empty search on page load
            },
            delay: 250, // Delay before sending the request
            processResults: function(data) {
                return {
                    results: data.data.map(function(city) {
                        return {
                            id: `${city.name}, ${city.state_iso_code}`,
                            text: `${city.name}, ${city.state_iso_code}`
                        };
                    })
                };
            },
            cache: true
        },
        minimumInputLength: 0 // Allow search with no input (default cities)
    });

	// Initialize Select2 for "Job Title" with dynamic job data
    $('#job_title').select2({
        placeholder: 'Search for a job title...',
        width: 'resolve',
        ajax: {
            url: function(params) {
                return `${apiConfig.apiBaseUrl}/api/typ/list-jobs?search=${params.term || ''}`;
            },
            delay: 250,
            processResults: function(data) {
                return {
                    results: data.data.map(function(job) {
                        return {
                            id: job.name,
                            text: job.name
                        };
                    })
                };
            },
            cache: true
        },
        minimumInputLength: 0
    });
// Initialize Select2 for "Company" with dynamic company data
    $('#company').select2({
        placeholder: 'Search for a company...',
        width: 'resolve',
        ajax: {
            url: function(params) {
                return `${apiConfig.apiBaseUrl}/api/companies/search?query=${params.term || ''}`;
            },
            delay: 250,
            processResults: function(data) {
                return {
                    results: data.data.map(function(company) {
                        return {
                            id: company.name,
                            text: company.name
                        };
                    })
                };
            },
            cache: true
        },
        minimumInputLength: 0
    });

	// Initialize Select2 for "Education" with dynamic university data
    $('#education').select2({
        placeholder: 'Search for a university...',
        width: 'resolve',
        ajax: {
            url: function(params) {
                return `${apiConfig.apiBaseUrl}/api/typ/list-universities?search=${params.term || ''}`;
            },
            delay: 250,
            processResults: function(data) {
                return {
                    results: data.data.map(function(university) {
                        return {
                            id: university.name,
                            text: university.name
                        };
                    })
                };
            },
            cache: true
        },
        minimumInputLength: 0
    });
	// Initialize Select2 for "Passions" with dynamic data from the passions API
    $('#passions').select2({
        placeholder: 'Search and select up to 5 passions...',
        maximumSelectionLength: 5, // Limit to 5 selections
        width: '100%', // Asegurar que ocupe todo el ancho disponible
    	dropdownAutoWidth: true, 
        ajax: {
            url: function(params) {
                return `${apiConfig.apiBaseUrl}/api/typ/list-passions?search=${params.term || ''}`;
            },
            delay: 250,
            processResults: function(data) {
                return {
                    results: data.data.map(function(passion) {
                        return {
                            id: passion.id,
                            text: passion.name
                        };
                    })
                };
            },
            cache: true
        },
        minimumInputLength: 0
    });

		// Initialize Select2 for Current Goals with multiple selections and dynamic dropdown
	$('#current_goals').select2({
		placeholder: 'Search and select one or more current goals...',
		width: '100%', 
		dropdownAutoWidth: true, 
		ajax: {
			url: function(params) {
				return `${apiConfig.apiBaseUrl}/api/typ/list-current-goals?search=${params.term || ''}`;
			},
			delay: 250,
			processResults: function(data) {
				return {
					results: data.data.map(function(goal) {
						return {
							id: goal.id,
							text: goal.name
						};
					})
				};
			},
			cache: true
		},
		minimumInputLength: 0
	});

	// Initialize Select2 for Education Levels with single selection and local search
	$('#education_level').select2({
		placeholder: 'Search and select your education level...',
		width: '100%',
		dropdownAutoWidth: true,
		data: [], // Initially empty, will be populated from the API
		ajax: {
			url: `${apiConfig.apiBaseUrl}/api/typ/list-education-levels`,
			processResults: function(data) {
				return {
					results: data.data.map(function(level) {
						return {
							id: level.id,
							text: level.name
						};
					})
				};
			},
			cache: true
		},
		minimumResultsForSearch: -1, // Always show the search box for local filtering
		minimumInputLength: 0,
		allowClear: true // Allow users to clear their selection
	});

	// Initialize Select2 for Industries with multiple selection
	$('#industry').select2({
		placeholder: 'Search and select industries...',
		width: '100%',
		dropdownAutoWidth: true,
		multiple: true,  // Multiple selection enabled
		ajax: {
			url: `${apiConfig.apiBaseUrl}/api/typ/list-industry`,
			processResults: function(data) {
				return {
					results: data.data.map(function(industry) {
						return {
							id: industry.id,
							text: industry.name
						};
					})
				};
			},
			cache: true
		},
		minimumInputLength: 0
	});

	// Initialize Select2 for Years of Experience with single selection
	$('#years_of_experience').select2({
		placeholder: 'Search and select your experience level...',
		width: '100%',
		dropdownAutoWidth: true,
		data: [],  // Initially empty, will be populated from the API
		ajax: {
			url: `${apiConfig.apiBaseUrl}/api/typ/list-years-of-experience`,
			processResults: function(data) {
				return {
					results: data.data.map(function(experience) {
						return {
							id: experience.id,
							text: experience.name
						};
					})
				};
			},
			cache: true
		},
		minimumResultsForSearch: -1,  // Always show the search box for local filtering
		minimumInputLength: 0,
		allowClear: true // Allow users to clear their selection
	});




    // Fetch default cities for both fields on load
    fetch(`${apiConfig.apiBaseUrl}/api/typ/list-cities?search=`)
        .then(response => response.json())
        .then(data => {
            const livesInSelect = $('#lives_in');
            const fromSelect = $('#from');

            data.data.forEach(function(city) {
                const option = new Option(`${city.name}, ${city.state_iso_code}`, city.id, false, false);
                livesInSelect.append(option).trigger('change');
                fromSelect.append(option).trigger('change');
            });
        });

    // Handle form submission
    document.getElementById('myngly-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const phoneCode = document.getElementById('phone_code').value;
        const phoneNumber = document.getElementById('phone_number').value;
        const fullPhoneNumber = phoneCode + phoneNumber;

        const passions = document.getElementById('passions');
		const currentGoals = $('#current_goals').val();
		const education = $('#education_level').val();
		const industries = $('#industry').val();
		const yearsOfExperience = $('#years_of_experience').val();
		const combinedFilterIds = currentGoals.concat(education, industries, yearsOfExperience);
		// combinedFilterIds.concat(educations);

        if (passions.selectedOptions.length !== 5) {
            alert("Please select exactly 5 passions.");
            return;
        }

        Swal.fire({
            title: 'Sending code...',
            text: 'Please wait while we send the code to your phone.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Send verification code to the phone number
        fetch(`${apiConfig.apiBaseUrl}/api/typ/sendcode`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone_number: fullPhoneNumber })
        })
        .then(response => response.json())
        .then(() => {
            Swal.close();

            Swal.fire({
                title: 'Enter the verification code',
                text: `A 6-digit code has been sent to your phone: ${fullPhoneNumber}`,
                input: 'tel',
                inputAttributes: {
                    autocapitalize: 'off',
                    maxlength: 6,
                    inputmode: 'numeric'
                },
                showCancelButton: true,
                confirmButtonText: 'Submit',
                didOpen: () => {
                    const input = Swal.getInput();
                    input.addEventListener('input', () => {
                        if (input.value.length === 6) {
                            Swal.clickConfirm();
                        }
                    });
                },
                preConfirm: (code) => {
					
                    const formData = {
                        code: code,
                        name: $('#name').val(),
                        email: $('#email').val(),
                        phone_number: fullPhoneNumber,
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
                        receive_news: $('#receive_news').val()
                    };

                    return fetch(`${apiConfig.apiBaseUrl}/api/typ/register`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.statusText);
                        }
                        return response.json();
                    })
                    .catch(error => {
                        Swal.showValidationMessage(`Request failed: ${error}`);
                    });
                }
            }).then(result => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Success!',
                        text: 'Registered successfully!',
                        icon: 'success'
                    });
                }
            });
        })
        .catch(error => {
            Swal.fire({
                title: 'Error!',
                text: 'Failed to send verification code!',
                icon: 'error'
            });
        });
    });


})(jQuery);
