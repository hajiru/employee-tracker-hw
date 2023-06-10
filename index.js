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
}
