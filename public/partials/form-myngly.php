<form id="myngly-form" method="POST" class="form-grid">
    <div class="form-group">
        <label for="phone_code">Country Code *</label>
        <select id="phone_code" name="phone_code" class="form-control" required></select>
    </div>

    <div class="form-group">
        <label for="phone_number">Phone Number *</label>
        <input type="text" name="phone_number" id="phone_number" placeholder="Enter your phone number" class="form-control" required>
    </div>

    <div class="form-group">
        <label for="name">Name *</label>
        <input type="text" name="name" id="name" placeholder="Enter your name" class="form-control" required>
    </div>

    <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" name="email" id="email" placeholder="email@example.com" class="form-control" required>
    </div>

    <div class="form-group">
        <label for="birthday_at">Birthday *</label>
        <input type="date" name="birthday_at" id="birthday_at" class="form-control" required>
    </div>

    <div class="form-group">
        <label for="gender">Gender *</label>
        <select name="gender" id="gender" class="form-control">
            <option value="Man">Man</option>
            <option value="Woman">Woman</option>
            <option value="Other">Other</option>
        </select>
    </div>

    <!-- Lives In select field with Select2 -->
    <div class="form-group">
        <label for="lives_in">Lives In *</label>
        <select name="lives_in" id="lives_in" class="form-control" required></select>
    </div>

    <!-- From select field with Select2 -->
    <div class="form-group">
        <label for="from">From * </label>
        <select name="from" id="from" class="form-control" required></select>
    </div>

    <div class="form-group">
        <label for="job_title">Job Title *</label>
        <select name="job_title" id="job_title" class="form-control" required></select>
    </div>

    <div class="form-group">
        <label for="company">Company *</label>
        <select name="company" id="company" class="form-control" required></select>
    </div>


    <div class="form-group">
        <label for="education_level">Education Level *</label>
        <select name="education_level" id="education_level" class="form-control" required></select>
        <small class="form-text text-muted">Select your education level</small>
    </div>

    <div class="form-group">
        <label for="education">Education *</label>
        <select name="education" id="education" class="form-control" required></select>
    </div>

    <div class="form-group">
        <label for="passions">Passions *</label>
        <select name="passions[]" id="passions" class="form-control" multiple required></select>
        <small class="form-text text-muted">Select up to 5 passions</small>
    </div>

    <div class="form-group">
        <label for="current_goals">Current Goals *</label>
        <select name="current_goals[]" id="current_goals" class="form-control" multiple></select>
        <small class="form-text text-muted">Select one or more current goals</small>
    </div>

    <div class="form-group">
        <label for="industry">Industries *</label>
        <select name="industry[]" id="industry" class="form-control" multiple></select>
        <small class="form-text text-muted">Select multiple industries</small>
    </div>

    <div class="form-group">
        <label for="years_of_experience">Years of Experience *</label>
        <select name="years_of_experience" id="years_of_experience" class="form-control" required></select>
        <small class="form-text text-muted">Select your experience level</small>
    </div>


    <div class="form-group">
        <label for="linkedin_connect">Connect with LinkedIn</label>
        <button id="linkedin_connect" type="button" class="btn btn-primary">Connect with LinkedIn</button>
    </div>

    <!-- Campo oculto para almacenar el ID del usuario -->
    <input type="hidden" name="linkedin_user_id" id="linkedin_user_id">


    <div class="form-group">
        <label for="linkedin_url">LinkedIn URL</label>
        <input type="url" name="linkedin_url" id="linkedin_url" class="form-control">
    </div>


    <div class="form-group col-12">
        <label for="about_me">About Me *</label>
        <textarea name="about_me" id="about_me" class="form-control" required></textarea>
    </div>

    <div class="form-group col-md-6">
        <label for="military_veteran">Military Veteran *</label>
        <select name="military_veteran" id="military_veteran" class="form-control" required>
            <option value="1">Yes</option>
            <option value="0">No</option>
        </select>
    </div>

    <div class="form-group col-md-6">
        <label for="receive_news">Receive news *</label>
        <select name="receive_news" id="receive_news" class="form-control" required>
            <option value="1">Yes</option>
            <option value="0">No</option>
        </select>
    </div>

    <div class="text-center">
        <button type="submit" class="btn btn-primary btn-sm">Submit</button>
    </div>
</form>
<br>