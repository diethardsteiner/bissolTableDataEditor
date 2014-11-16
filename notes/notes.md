

# Open points

## Table pagination

Open source project: http://www.datatables.net/examples/styling/bootstrap.html

dataTables file are already included in CDF, so there is no need to reference them.

[Bootstrap Styling](https://editor.datatables.net/examples/styling/bootstrap.html).

To get the proper bootstrap styling add following files from the examples package folder `examples/resources/bootstrap/3`:

- `dataTables.bootstrap.css`
- `dataTables.bootstrap.js`

## Table Editor Record Add, Update, Remove

use modals: http://getbootstrap.com/javascript/

## OrientDB

CDE makes use of [OrientDB](http://www.orientechnologies.com/orientdb/) - is there any chance to use it for this project as well?

DB files are stored in `pentaho-solutions/system/.orient`.


# Submitted Sparkl Jira Cases

[Endpoints for Kettle sub-transformation steps](http://jira.pentaho.com/browse/SPARKL-65)

[Endpoints for last transformation within job](http://jira.pentaho.com/browse/SPARKL-66)

[Automatically included dependend Kettle plugins](http://jira.pentaho.com/browse/SPARKL-67)

[Kettle: Return DB error/status message](http://jira.pentaho.com/browse/PDI-12719)

[DB Schema Names are shown instead of DB Connection Names](https://github.com/webdetails/kettle-baserver-utils/issues/2)

[Persistant storage: Document DB](http://jira.pentaho.com/browse/SPARKL-96)

# Validation

input type ... this will render a date picker automatically
http://diveintohtml5.info/forms.html
excellent article also describing fallback strategies


http://www.w3schools.com/html/html5_form_input_types.asp


text

number
range

date
datetime
datetime-local
time
week
month

color
email
tel
url


pattern (is text as well as input type, so just for display purposes)



Input Restrictions

disabled	Specifies that an input field should be disabled
max	Specifies the maximum value for an input field
maxlength	Specifies the maximum number of character for an input field
min	Specifies the minimum value for an input field
pattern	Specifies a regular expression to check the input value against
readonly	Specifies that an input field is read only (cannot be changed)
required	Specifies that an input field is required (must be filled out)
size	Specifies the width (in characters) of an input field
step	Specifies the legal number intervals for an input field
value	Specifies the default value for an input field

pattern:
Country code: `<input type="text" name="country_code" pattern="[A-Za-z]{3}" title="Three letter country code">`
Use the global title attribute to describe the pattern to help the user.

required

## Polyfill

[HTML5 Form Shim](http://dsheiko.github.io/HTML5-Form-Shim/)

### Bootstrap Date Picker
[Info1](http://bootstrap-datepicker.readthedocs.org/en/release/)
[Info2](https://github.com/eternicode/bootstrap-datepicker/blob/release/docs/index.rst)
[Github](https://github.com/eternicode/bootstrap-datepicker/) repo
[Here](http://eternicode.github.io/bootstrap-datepicker/?markup=component&format=yyyy-mm-dd&weekStart=&startDate=&endDate=&startView=0&minViewMode=0&todayBtn=false&language=en&orientation=auto&multidate=&multidateSeparator=&keyboardNavigation=on&forceParse=on#sandbox) you can just tick the options you need and it will output the code.

THIS ONE SEEMS TO BE EVEN BETTER AND STILL MAINTAINED:
http://eonasdan.github.io/bootstrap-datetimepicker/
https://github.com/Eonasdan/bootstrap-datetimepicker