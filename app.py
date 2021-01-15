from flask import Flask, redirect, url_for, render_template, request, session, flash
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy

from flask_wtf import FlaskForm, Form
from wtforms import StringField, SubmitField, PasswordField, BooleanField, validators
from wtforms.validators import DataRequired

from flask_bootstrap import Bootstrap
from sqlalchemy.sql import select

app = Flask(__name__)
app.secret_key = "a super secret here"

Bootstrap(app)

#Keep the session alive for the specified time length
app.permanent_session_lifetime = timedelta(days=1) #Can be days or minutes

#Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3' #Notice the 3 forward slashes and the "users" is going to be the name of the table
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False #Removes the warnings
db = SQLAlchemy(app)

#Create a model/object for the database (Columns represent pieces of information and the rows represent individual items)
class users(db.Model):
  _id = db.Column('id', db.Integer, primary_key=True)
  name_first = db.Column('first-name', db.String(100))
  name_last = db.Column('last-name', db.String(100))
  email = db.Column('email', db.String(100))
  password = db.Column('password', db.String(100))

  def __init__(self, name_first, name_last, email, password):
    self.name_first = name_first
    self.name_last = name_last
    self.email = email
    self.password = password

class UserRegistryForm(FlaskForm):
    name_first = StringField('First Name', validators=[DataRequired()])
    name_last = StringField('Last Name', [validators.DataRequired()])
    email = StringField('Email', [validators.DataRequired(), validators.Email(), validators.Length(min=6, max=35)])
    password = PasswordField('New Password', [validators.DataRequired(), validators.EqualTo('confirm', message='Passwords must match')])
    confirm = PasswordField('Repeat Password')
    submit = SubmitField('Register')

@app.route("/")
def home():
  return render_template("index.html")

@app.route("/todo")
def to_do():
  return render_template("todo.html")

@app.route("/login",  methods=['POST', 'GET'])
def login():
  if request.method == "POST":
    session.permanent = True
    email_data = request.form["email"]
    password_data = request.form["password"]

    if email_data == '' or password_data == '':
      flash('Enter a valid email and password')
      return redirect("login")

    found_user = users.query.filter_by(email=email_data).first()
    if found_user:
      pwd = found_user.password
      if pwd == password_data:
        flash("Login Successful")
        return render_template("todo.html", name=found_user.name_first.capitalize())
    else:
      flash("Wrong credentials")
      return redirect('login')
  else:
    return render_template("login.html")

@app.route("/logout")
def logout():
  if "user" in session:
    user = session["user"]
    flash("You have logged out", "info")
  session.pop("user", None)
  session.pop("email", None)
  return redirect(url_for("login"))

@app.route("/create_usr", methods=["POST", "GET"])
def create_user():
  form = UserRegistryForm()
  if request.method == 'POST' and form.validate_on_submit():
    name_first = request.form['name_first']
    name_last = request.form['name_last']
    email = request.form['email']
    password = request.form['password']
    exist = users.query.filter_by(email=email).first()
    if exist:
      flash('The address %s is already in use, choose another one' % email, 'Or sign in')
      return redirect("create_usr")
    curr_usr = users(name_first, name_last, email, password)
    db.session.add(curr_usr)
    db.session.commit()

    flash("Login Succesful")
    return render_template(url_for("todo"))
  else:
    return render_template('create_usr.html', title="Create account", form=form)


if __name__ == "__main__":
  db.create_all()
  app.run(debug=True)