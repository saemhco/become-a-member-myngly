<form id="myngly-form" method="POST" class="form-grid">

    <!-- Profile Picture and LinkedIn Connect Button (Centered at the top) -->
    <div class="form-group text-center" style="grid-column: span 2;">
        <img id="profile-photo" src="https://via.placeholder.com/100" alt="Anonymous Profile Photo" class="img-fluid rounded-circle mb-3" style="width: 100px; height: 100px;">
        <br>
        <label id="linkedin-connect" class="btn btn-primary btn-sm">Connect with LinkedIn</label>
    </div>

    <!-- Hidden fields for LinkedIn data -->
    <input type="hidden" name="image_url" id="image_url" required>
    <input type="hidden" id="linkedin-user-id" name="linkedin_user_id">
    <input type="hidden" id="linkedin-profile" name="linkedin_profile"> <!-- To store JSON -->

    <!-- Name -->
    <div class="form-group">
        <label for="name">Name *</label>
        <input type="text" name="name" id="name" placeholder="Enter your name" class="form-control" required>
    </div>

    <!-- Email -->
    <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" name="email" id="email" placeholder="email@example.com" class="form-control" required>
    </div>

    <!-- Phone Code -->
    <div class="form-group">
        <label for="phone_code">Country Code *</label>
        <select id="phone_code" name="phone_code" class="form-control" data-endpoint2="/api/typ/countries/phone-codes" required></select>
    </div>

    <!-- Phone Number -->
    <div class="form-group">
        <label for="phone_number">Phone Number *</label>
        <input type="text" name="phone_number" id="phone_number" placeholder="Enter your phone number" class="form-control" required>
    </div>

    <!-- Birthday -->
    <div class="form-group">
        <label for="birthday_at">Birthday *</label>
        <input type="date" name="birthday_at" id="birthday_at" class="form-control" required>
    </div>

    <!-- Gender -->
    <div class="form-group">
        <label for="gender">Gender *</label>
        <select name="gender" id="gender" class="form-control" required>
            <option value="Man">Man</option>
            <option value="Woman">Woman</option>
            <option value="Other">Other</option>
        </select>
    </div>

    <!-- Location (Lives In & From) -->
    <div class="form-group">
        <label for="lives_in">Lives In *</label>
        <select name="lives_in" id="lives_in" class="form-control" data-endpoint="/api/typ/list-cities" required></select>
    </div>

    <div class="form-group">
        <label for="from">From *</label>
        <select name="from" id="from" class="form-control" data-endpoint="/api/typ/list-cities" required></select>
    </div>

    <!-- Job Title -->
    <div class="form-group">
        <label for="job_title">Job Title *</label>
        <select name="job_title" id="job_title" class="form-control" data-endpoint="/api/typ/list-jobs" required></select>
    </div>

    <!-- Company -->
    <div class="form-group">
        <label for="company">Company *</label>
        <select name="company" id="company" class="form-control" data-endpoint="/api/companies/search" data-search-key="query" required></select>
    </div>

    <!-- Education Level -->
    <div class="form-group">
        <label for="education_level">Education Level *</label>
        <select name="education_level" id="education_level" class="form-control" data-endpoint2="/api/typ/list-education-levels" data-id-key="id" required></select>
        <small class="form-text text-muted">Select your education level</small>
    </div>

    <!-- Education (Universities) -->
    <div class="form-group">
        <label for="education">Education *</label>
        <select name="education" id="education" class="form-control" data-endpoint="/api/typ/list-universities" required></select>
    </div>

    <!-- Passions (Multiple Select) -->
    <div class="form-group">
        <label for="passions">Passions *</label>
        <select name="passions[]" id="passions" class="form-control" multiple required></select>
        <small class="form-text text-muted">Select up to 5 passions</small>
    </div>

    <!-- Current Goals (Multiple Select) -->
    <div class="form-group">
        <label for="current_goals">Current Goals *</label>
        <select name="current_goals[]" id="current_goals" class="form-control" multiple></select>
        <small class="form-text text-muted">Select one or more current goals</small>
    </div>

    <!-- Industries (Multiple Select) -->
    <div class="form-group">
        <label for="industry">Industries *</label>
        <select name="industry[]" id="industry" class="form-control" multiple></select>
        <small class="form-text text-muted">Select multiple industries</small>
    </div>

    <!-- Years of Experience -->
    <div class="form-group">
        <label for="years_of_experience">Years of Experience *</label>
        <select name="years_of_experience" id="years_of_experience" class="form-control" required></select>
        <small class="form-text text-muted">Select your experience level</small>
    </div>

    <!-- About Me (Full width) -->
    <div class="form-group" style="grid-column: span 2;">
        <label for="about_me">About Me *</label>
        <textarea name="about_me" id="about_me" class="form-control" required></textarea>
    </div>

    <!-- Military Veteran -->
    <div class="form-group">
        <label for="military_veteran">Military Veteran *</label>
        <select name="military_veteran" id="military_veteran" class="form-control" required>
            <option value="1">Yes</option>
            <option value="0">No</option>
        </select>
    </div>

    <!-- Receive News -->
    <div class="form-group">
        <label for="receive_news">Receive News *</label>
        <select name="receive_news" id="receive_news" class="form-control" required>
            <option value="1">Yes</option>
            <option value="0">No</option>
        </select>
    </div>

    <!-- Submit Button (Full width) -->
    <div class="text-center" style="grid-column: span 2;">
        <button type="submit" class="btn btn-primary btn-sm">Submit</button>
    </div>
</form>