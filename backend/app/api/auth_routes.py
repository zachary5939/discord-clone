from flask import Blueprint, jsonify, session, request
from ..models import User, db
from ..forms import LoginForm
from ..forms import UserForm
from flask_login import current_user, login_user, logout_user, login_required
from sqlalchemy import or_
from ..utils.validate_errors import validation_errors_to_error_messages

auth_routes = Blueprint('auth', __name__, url_prefix="/auth")


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': ['Unauthorized']}


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        credentials = form.data['credentials']
        user = User.query.filter(or_(
            User.email == credentials,
            User.username == credentials)).first()
        login_user(user)
        return user.to_dict_servers()
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = UserForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        user_data = {
            val: form.data[val] for val in form.data if val != 'csrf_token'
        }
        user = User(**user_data)
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return user.to_dict_extra(), 201
    print(form.errors)
    return {'errors': validation_errors_to_error_messages(form.errors)}, 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': ['Unauthorized']}, 401
