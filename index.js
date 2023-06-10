const inquirer = require("inquirer");
// require inquirer
require("console.table");

const employeeDb = require("./db/queries");

init();

function init() {
    console.log("test test");
}

const userPrompts = [
    {
        type: "list",
        name: "menuChoice",
        message: "What do you want to do?",
        choices: [
            {
                name: "View All Departments",
                value: 1,
            },
            {
                name: "View All Roles",
                value: 2,
            },
            {
                name: "View All Employees",
                value: 3,
            },
            {
                name: "Add Department",
                value: 4,
            },
            {
                name: "Add Role",
                value: 5,
            },
            {
                name: "Add Employee",
                value: 6,
            },
            {
                name: "Update Employee Role",
                value: 7,
            },
            {
                name: "Quit",
                value: 8,
            },
        ],
    },
];

const createDepart = [
    {
        type: "input",
        name: "newDepart",
        message: "Enter the name of the new department",
    },
];

function firstProm() {
    menu = () => {
        inquirer.prompt(userPrompts).then((answer) => {
            switch (answer.menuChoice) {
                case 1:
                    listDepart();
                    break;
                case 2:
                    listRoles();
                    break;
                case 3:
                    listEmployees();
                    break;
                case 4:
                    addDepart();
                    break;
                case 5:
                    addRole();
                    break;
                case 6:
                    addEmployee();
                    break;
                case 7:
                    updateEmployee();
                    break;
                case 8:
                    employeeDb.connection.end();
                    break;
            }
        });
    };

    menu();
    // function to list departments
    function listDepart() {
        employeeDb
            .allDepartments()
            .then(([rows]) => {
                let department = rows;
                console.table("Departments", department);
            })
            .then(() => menu());
    }

    // function to list roles
    function listRoles() {
        employeeDb
            .allRoles()
            .then(([rows]) => {
                let role = rows;
                console.table("Roles", role);
            })
            .then(() => menu());
    }

    // function to list employees
    function listEmployees() {
        employeeDb
            .allEmployees()
            .then(([rows]) => {
                let employee = rows;
                console.table("Employees", employee);
            })
            .then(() => menu());
    }

    // function to add department
    function addDepart() {
        inquirer
            .prompt(createDepart)
            .then((answer) => {
                let name = answer.newDepart;
                employeeDb.insertDepartment(name);
                console.log(`'${name}' added to department database`);
            })
            .then(() => menu());
    }
    // function to add role
    function addRole() {
        employeeDb.allDepartments().then(([rows]) => {
            let departments = rows;
            const seeDepartment = departments.map(({ id, name }) => ({
                name: name,
                value: id,
            }));

            inquirer
                .prompt([
                    {
                        type: "input",
                        name: "title",
                        message: "Enter the new role",
                    },
                    {
                        type: "input",
                        name: "salary",
                        message: "Enter the salary for this role",
                        validate: (answer) => {
                            if (isNaN(answer)) {
                                return "do not include '$' or ',' in salary input";
                            }
                            return true;
                        },
                    },
                    {
                        type: "list",
                        name: "department_id",
                        message: "Enter the department this role belongs to",
                        choices: seeDepartment,
                    },
                ])
                .then((answer) => {
                    employeeDb
                        .insertRole(answer)
                        .then(() =>
                            console.log(
                                `${answer.title} added to role database`
                            )
                        );
                })
                .then(() => menu());
        });
    }
    // function to add employee
    function addEmployee() {
        inquirer
            .prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "Enter the first name of the employee",
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "Enter the last name of the employee",
                },
            ])
            .then((answer) => {
                let firstName = answer.first_name;
                let lastName = answer.last_name;

                employeeDb.allRoles().then(([rows]) => {
                    let roles = rows;

                    const showRoles = roles.map(({ id, title }) => ({
                        name: title,
                        value: id,
                    }));

                    inquirer
                        .prompt([
                            {
                                type: "list",
                                name: "role_id",
                                message: "Enter the employee's role",
                                choices: showRoles,
                            },
                        ])
                        .then((answer) => {
                            let roleID = answer.role_id;

                            employeeDb.allEmployees().then(([rows]) => {
                                let managers = rows;
                                const listManagers = managers.map(
                                    ({ id, first_name, last_name }) => ({
                                        name: `${first_name} ${last_name}`,
                                        value: id,
                                    })
                                );

                                inquirer
                                    .prompt([
                                        {
                                            type: "list",
                                            name: "manager_id",
                                            message:
                                                "Enter the employee's manager",
                                            choices: listManagers,
                                        },
                                    ])
                                    .then((answer) => {
                                        let managerID = answer.manager_id;

                                        let newEmployee = {
                                            first_name: firstName,
                                            last_name: lastName,
                                            role_id: roleID,
                                            manager_id: managerID,
                                        };

                                        employeeDb.insertEmployee(newEmployee);
                                        console.log(
                                            `${firstName} ${lastName} has been added to employee database.`
                                        );
                                    })
                                    .then(() => menu());
                            });
                        });
                });
            });
    }

    // function to update employee role
    function updateEmployee() {
        employeeDb.allEmployees().then(([rows]) => {
            let employees = rows;

            const listEmployees = employees.map(
                ({ id, first_name, last_name }) => ({
                    name: `${first_name} ${last_name}`,
                    value: id,
                })
            );

            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        choices: listEmployees,
                    },
                ])
                .then((answer) => {
                    let employee_id = answer.employee;

                    employeeDb.allRoles().then(([rows]) => {
                        let roles = rows;
                        const listRoles = roles.map(({ id, title }) => ({
                            name: title,
                            value: id,
                        }));
                        inquirer
                            .prompt([
                                {
                                    type: "list",
                                    name: "role_id",
                                    message: "Enter the new role",
                                    choices: listRoles,
                                },
                            ])
                            .then((answer) => {
                                let newRole = answer.role_id;

                                employeeDb.updateEmployeeRole(
                                    newRole,
                                    employee_id
                                );

                                console.log("Employee role has been updated");
                            })
                            .then(() => menu());
                    });
                });
        });
    }
}

firstProm();