-- POSTGRESQL
psql -Upostgres test
-- table with auto-incremented key
DROP TABLE IF EXISTS public.employees;
CREATE TABLE public.employees
(
		employee_id SERIAL
	, firstname VARCHAR(70)
	, lastname VARCHAR(70)
	, start_date DATE
	, last_checkin TIMESTAMP
	, daily_break_time TIME
)
;

-- table non auto-incremented key
DROP TABLE IF EXISTS public.offices;
CREATE TABLE public.offices
(
	office_id INT4
	, city VARCHAR(70)
	, country VARCHAR(70)
	, employees_count INT4
)
;

ALTER TABLE public.offices ADD PRIMARY KEY (office_id);

-- MYSQL
mysql -uroot -proot test
-- table with auto-incremented key
DROP TABLE IF EXISTS employees;
CREATE TABLE employees
(
	employee_id INT PRIMARY KEY AUTO_INCREMENT
	, firstname VARCHAR(70)
	, lastname VARCHAR(70)
	, start_date DATE
	, last_checkin TIMESTAMP
	, daily_break_time TIME
) ENGINE=MYISAM
;

-- table non auto-incremented key
DROP TABLE IF EXISTS offices;
CREATE TABLE offices
(
	office_id INT4 PRIMARY KEY
	, city VARCHAR(70)
	, country VARCHAR(70)
	, employees_count INT4
) ENGINE=MYISAM
;