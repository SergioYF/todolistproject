var React = require('react');
var ReactDOM = require('react-dom');
var FileSaver = require('file-saver');
require('./style.css');

function T(title, expired_date) {
	this.title = title;
	this.completed = false;
	this.detail = "No detail.";
	this.priority = 2;
	this.expired_date = expired_date;
	this.click = false;
}

var TodosList = React.createClass({
	displayName: 'TodosList',

	loadTodosFromServer: function () {
		$.ajax({
			url: this.props.url,
			datatype: 'json',
			cache: false,
			success: function (data) {
				this.setState({ todolist: data });
			}.bind(this)
		});
	},

	getInitialState: function () {
		return { todolist: [] };
	},

	componentDidMount: function () {
		this.loadTodosFromServer();
		setInterval(this.loadTodosFromServer, this.props.pollInterval);
	},

	handleReplace: function (mes) {
		this.setState({
			todolist: mes
		});
	},

	render: function () {
		if (this.state.todolist) {
			console.log('DATA!');
		}
		return React.createElement(
			'div',
			null,
			React.createElement(
				'h1',
				null,
				'TodoList Sergea'
			),
			React.createElement(TypeNew, { replace: this.handleReplace, todos: this.state.todolist }),
			React.createElement(ListTodo, { replace: this.handleReplace, todos: this.state.todolist }),
			React.createElement(SaveListTodo, { url: this.props.url, todos: this.state.todolist })
		);
	}
});

var Detail = React.createClass({
	displayName: 'Detail',

	render: function () {
		return React.createElement(
			'form',
			{ onSubmit: this.props.saveContent, className: 'form' },
			React.createElement(
				'textarea',
				{ rows: '4', cols: '45', type: 'text', ref: 'content', id: 'textarea' },
				this.props.detail
			),
			React.createElement('input', { type: 'submit', value: '\u4FDD\u5B58', className: 'save' })
		);
	}
});

var TypeNew = React.createClass({
	displayName: 'TypeNew',

	addContent: function (e) {
		e.preventDefault();
		var tet = this.refs.content.value.trim();
		var dat = this.refs.date.value.trim();
		var todo = new T(tet, dat);
		if (tet != '') {
			var new_length = this.props.todos.push(todo);
			this.props.replace(this.props.todos);
		}
		this.refs.content.value = '';
		this.refs.date.value = '';
	},

	render: function () {
		return React.createElement(
			'form',
			{ onSubmit: this.addContent, className: 'form' },
			React.createElement('input', { type: 'text', ref: 'content', className: 'input' }),
			React.createElement('input', { type: 'submit', value: '\u6DFB\u52A0', className: 'add' }),
			React.createElement(
				'div',
				null,
				React.createElement(
					'label',
					null,
					' \u622A\u6B62\u65E5\u671F\uFF1A '
				),
				React.createElement('input', { type: 'date', ref: 'date', placeholder: 'YYYY-MM-DD', id: 'txtDate' })
			)
		);
	}
});

var SaveListTodo = React.createClass({
	displayName: 'SaveListTodo',

	saveJSON: function (e) {
		e.preventDefault();
		var data = this.props.todos;
		var string = JSON.stringify(data);
		$.get("/todolist/save", { 'str': string });
		alert("保存成功！");
	},

	render: function () {
		return React.createElement(
			'form',
			{ onSubmit: this.saveJSON, action: '/todolist/save', method: 'get' },
			React.createElement('input', { type: 'submit', value: '\u4FDD\u5B58', className: 'add' }),
			React.createElement(
				'p',
				null,
				' \u6CE8\uFF1A\u6682\u4E0D\u652F\u6301\u6C49\u5B57\u8F93\u5165 '
			)
		);
	}
});

var ListTodo = React.createClass({
	displayName: 'ListTodo',

	delContent: function (e) {
		var i = e.target.getAttribute("data-index");
		this.props.todos.splice(i, 1);
		this.props.replace(this.props.todos);
	},

	completeContent: function (e) {
		var i = e.target.getAttribute("data-index");
		var todos = this.props.todos;
		todos[i].completed = true;
		this.props.replace(todos);
	},

	clickTodo: function (e) {
		var i = e.target.getAttribute("data-index");
		var todos = this.props.todos;
		var new_todos = this.props.todos.map(function (todo, j) {
			if (j == i) {
				todo.click = true;
			} else {
				todo.click = false;
			}
			return todo;
		});
		this.props.replace(new_todos);
	},

	saveDetail: function (e) {
		e.preventDefault();
		var i = -1;
		for (let j = 0; j < this.props.todos.length; j++) {
			if (this.props.todos[j].click === true) {
				i = j;
			}
		};
		var tet = document.getElementById("textarea").value;
		var todos = this.props.todos;
		todos[i].detail = tet;
		this.props.replace(todos);
		todos.map(function (todo) {
			todo.click = false;
		});
		this.refs.content.value = '';
	},

	saveAttr: function (e) {
		e.preventDefault();
		var i = -1;
		for (let j = 0; j < this.props.todos.length; j++) {
			if (this.props.todos[j].click === true) {
				i = j;
			}
		};
		var tet = document.getElementById("textarea").value;
		var dat = this.refs.date.value.trim();
		var pri = this.refs.priority.value.trim();
		var todos = this.props.todos;
		if (dat !== '') {
			todos[i].expired_date = dat;
		}
		if (pri !== '') {
			todos[i].priority = pri;
		}
		todos[i].detail = tet;
		this.props.replace(todos);
		todos.map(function (todo) {
			todo.click = false;
		});
	},

	render: function () {
		return React.createElement(
			'ul',
			{ id: 'todo-list' },
			this.props.todos.map(function (todo, i) {
				if (todo.start_date) {
					var start_date = todo.start_date;
				} else {
					var start_date = "今天";
				}
				if (todo.completed === true && todo.click === true) {
					return React.createElement(
						'li',
						{ className: 'content' },
						React.createElement(
							's',
							null,
							todo.title
						),
						React.createElement(
							'span',
							{ className: 'del', onClick: this.delContent, 'data-index': i },
							'\u5220\u9664'
						),
						React.createElement(
							'span',
							{ className: 'del', onClick: this.clickTodo, 'data-index': i },
							'\u67E5\u770B\u8BE6\u60C5'
						),
						React.createElement(
							'div',
							null,
							React.createElement(Detail, { detail: todo.detail, saveContent: this.saveDetail }),
							React.createElement(
								'form',
								{ className: 'form' },
								React.createElement(
									'label',
									null,
									' \u5F00\u59CB:',
									start_date,
									' \u622A\u6B62 '
								),
								React.createElement('input', { type: 'date', ref: 'date', placeholder: todo.expired_date, id: 'txtDate', size: '10' }),
								React.createElement(
									'label',
									null,
									' \u4F18\u5148\u7EA7 '
								),
								React.createElement('input', { type: 'date', ref: 'priority', placeholder: todo.priority, id: 'priority', size: '2' })
							)
						)
					);
				} else if (todo.completed === true && todo.click === false) {
					return React.createElement(
						'li',
						{ className: 'content' },
						React.createElement(
							's',
							null,
							todo.title
						),
						React.createElement(
							'span',
							{ className: 'del', onClick: this.delContent, 'data-index': i },
							'\u5220\u9664'
						),
						React.createElement(
							'span',
							{ className: 'del', onClick: this.clickTodo, 'data-index': i },
							'\u67E5\u770B\u8BE6\u60C5'
						)
					);
				} else if (todo.completed === false && todo.click === true) {
					return React.createElement(
						'li',
						{ className: 'content' },
						React.createElement(
							'label',
							null,
							todo.title
						),
						React.createElement(
							'span',
							{ className: 'del', onClick: this.delContent, 'data-index': i },
							'\u5220\u9664'
						),
						React.createElement(
							'span',
							{ className: 'del', onClick: this.completeContent, 'data-index': i },
							'\u5B8C\u6210'
						),
						React.createElement(
							'span',
							{ className: 'del', onClick: this.clickTodo, 'data-index': i },
							'\u67E5\u770B\u8BE6\u60C5'
						),
						React.createElement(
							'div',
							null,
							React.createElement(Detail, { detail: todo.detail, saveContent: this.saveAttr }),
							React.createElement(
								'form',
								{ className: 'form' },
								React.createElement(
									'label',
									null,
									' \u5F00\u59CB:',
									start_date,
									' \u622A\u6B62 '
								),
								React.createElement('input', { type: 'date', ref: 'date', placeholder: todo.expired_date, id: 'txtDate', size: '10' }),
								React.createElement(
									'label',
									null,
									' \u4F18\u5148\u7EA7 '
								),
								React.createElement('input', { type: 'date', ref: 'priority', placeholder: todo.priority, id: 'priority', size: '2' })
							)
						)
					);
				} else {
					return React.createElement(
						'li',
						{ className: 'content' },
						React.createElement(
							'label',
							null,
							todo.title
						),
						React.createElement(
							'span',
							{ className: 'del', onClick: this.delContent, 'data-index': i },
							'\u5220\u9664'
						),
						React.createElement(
							'span',
							{ className: 'del', onClick: this.completeContent, 'data-index': i },
							'\u5B8C\u6210'
						),
						React.createElement(
							'span',
							{ className: 'del', onClick: this.clickTodo, 'data-index': i },
							'\u67E5\u770B\u8BE6\u60C5'
						)
					);
				}
			}.bind(this))
		);
	}
});

d1 = document.getElementById('container');
d1.style.cssText += 'text-align:center';
ReactDOM.render(React.createElement(TodosList, { url: '/todolist/', pollInterval: 600000 }), d1);
