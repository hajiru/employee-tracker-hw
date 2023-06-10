USE employees;

INSERT INTO department (name)
VALUES 
  ('Management'),
  ('Human Resources'),
  ('Accounting'),
  ('Development');
  
INSERT INTO role (title, salary, department_id)
VALUES 
  ('CEO', 150000, 1),
  ('Executive Assistant', 80000, 1),
  ('HR Manager', 100000, 2),
  ('HR Assistant', 75000, 2),
  ('Accountant', 95000, 3),
  ('Senior Developer', 170000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  
  ('Pieck', 'Finger', 1, NULL),
  ('Mikasa', 'Ackerman', 2, 1),
  ('Armin', 'Arlert', 3, 2),
  ('Eren', 'Yeager', 4, 3);
