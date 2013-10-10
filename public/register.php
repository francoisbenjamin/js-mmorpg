<!DOCTYPE html>
<html>
    <head>
        <!-- CSS -->
		<link rel="stylesheet" type="text/css" href="./css/main.css" />
		<link rel="stylesheet" type="text/css" href="./css/bootstrap.min.css" />
        <!-- Node -->
       	<script src="http://localhost:8000/socket.io/socket.io.js"></script>
        <!-- JQuery -->
        <script src="libs/jquery.js"></script>
        <!-- Mordernizr -->
        <script src="libs/modernizr.js"></script>
        <script src="js/register.js"></script>
        <meta charset="utf-8"/>
        <meta name="description" content="MMORPG Javascript"/>
        <meta name="author" content="Benjamin 'Shinochi' FRANÇOIS"/>
        <title>Register Page</title>
    </head>
    <body>
    		<h1>Registration Page</h1>
    	<div>
    		<div id="error" style="display:none; margin : 0 auto; width: 300px; text-align: center;" class="alert alert-error alert-block">Random error</div>
    		<form id="registration" name="registration" method="POST" action="addAccount.php">
    			<label>Login : </label>
    			<input id="login" name="login" type="text" placeholder="Login" autofocus required/>
    			
    			<label>Password : </label>
    			<input id="password" name="password" type="password" placeholder="Password" required/>
    			
    			<label>Confirm password : </label>
    			<input id="password_confirmation" name="password_confirmation" type="password" placeholder="Password confirmation" required/>
    			
    			<label>Email : </label>
    			<input id="email" name="email" type="email" pattern="^[a-z|0-9|A-Z]*([_][a-z|0-9|A-Z]+)*([.][a-z|0-9|A-Z]+)*([.][a-z|0-9|A-Z]+)*(([_][a-z|0-9|A-Z]+)*)?@[a-z][a-z|0-9|A-Z]*\.([a-z][a-z|0-9|A-Z]*(\.[a-z][a-z|0-9|A-Z]*)?)$" placeholder="youremail@.com" required/>
    			
    			<label>Confirm email : </label>
    			<input id="email_confirmation" name="email_confirmation" type="email" pattern="^[a-z|0-9|A-Z]*([_][a-z|0-9|A-Z]+)*([.][a-z|0-9|A-Z]+)*([.][a-z|0-9|A-Z]+)*(([_][a-z|0-9|A-Z]+)*)?@[a-z][a-z|0-9|A-Z]*\.([a-z][a-z|0-9|A-Z]*(\.[a-z][a-z|0-9|A-Z]*)?)$"  placeholder="youremail@.com" required/>
    			<br/>
    			<button id="submit" class="btn btn-primary">Register</button>
    		</form>
    	</div>

    </body>
</html>