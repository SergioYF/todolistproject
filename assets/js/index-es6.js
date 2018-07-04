var React = require('react')
var ReactDOM = require('react-dom')
var FileSaver = require('file-saver')
require('./style.css')

function T(title, expired_date){
	this.title = title;
	this.completed = false;
	this.detail = "";
	this.priority = 2;
	this.expired_date = expired_date;
	this.click = false;
}

var TodosList = React.createClass({
    loadTodosFromServer: function(){
        $.ajax({
            url: this.props.url,
            datatype: 'json',
            cache: false,
            success: function(data) {
                this.setState({todolist: data});
            }.bind(this)
        })
    },

    getInitialState: function() {
        return {todolist: []};
    },

    componentDidMount: function() {
        this.loadTodosFromServer();
        setInterval(this.loadTodosFromServer,
                    this.props.pollInterval)
    },

    handleReplace: function(mes){
		this.setState({
			todolist: mes
		});
	},

    render: function() {
        if (this.state.todolist) {
            console.log('DATA!')
        }
        return (
            <div>
                <h1>TodoList Sergea</h1>
				<TypeNew replace={this.handleReplace} todos={this.state.todolist} />
				<ListTodo replace={this.handleReplace} todos={this.state.todolist} />
				<SaveListTodo url={this.props.url} todos={this.state.todolist} />
            </div>
        )
    }
})

var Detail = React.createClass({
	render: function(){
		return(
			<form onSubmit={this.props.saveContent} className="form">
	        	<textarea rows="4" cols="45" type="text" ref="content" id="textarea" >{this.props.detail}</textarea>
	        	<input type="submit" value="保存" className="save" />
	        </form>
        )
	}
})

var TypeNew = React.createClass({
	addContent: function(e){
		e.preventDefault();
		var tet = this.refs.content.value.trim();
		var dat = this.refs.date.value.trim();
		// alert(dat);
		var todo = new T(tet, dat);
		if(tet!=''){
			var new_length = this.props.todos.push(todo);
			this.props.replace(this.props.todos);
		}
		this.refs.content.value='';
		this.refs.date.value='';
	},

	render: function(){
		return(
			<form onSubmit={this.addContent} className="form">
				<input type="text" ref="content" className="input" />
				<input type="submit" value="添加" className="add" />
				<div>
					<label> 截止日期： </label>
					<input type="date" ref="date" placeholder="YYYY-MM-DD" id="txtDate" />
				</div>
			</form>
		);
	}
})

var SaveListTodo = React.createClass({
	saveJSON: function(e){
		e.preventDefault();
		var data = this.props.todos;
		var string = JSON.stringify(data);
		$.get("/todolist/save", {'str': string});
		alert("保存成功！");
	},

	render: function() {
		return(
			<form onSubmit={this.saveJSON} action="/todolist/save" method="get">
				<input type="submit" value="保存" className="add" />
				<p> 注：暂不支持汉字输入 </p>
			</form>
		)
    }
})

var ListTodo = React.createClass({
	delContent: function(e){
		var i = e.target.getAttribute("data-index");
		this.props.todos.splice(i,1);
		this.props.replace(this.props.todos);
	},

	completeContent: function(e){
		var i = e.target.getAttribute("data-index");
		var todos = this.props.todos;
		todos[i].completed = true;
		this.props.replace(todos);
	},

	clickTodo: function(e){
		var i = e.target.getAttribute("data-index");
		var todos = this.props.todos;
		var new_todos = this.props.todos.map(function(todo,j){
			if(j==i){
				todo.click = true;
			}
			else{
				todo.click = false;
			}
			return todo;
		});
		this.props.replace(new_todos);
	},

	saveDetail: function(e){
		e.preventDefault();
		var i = -1;
		for (let j = 0; j < this.props.todos.length; j++) {
			if(this.props.todos[j].click === true){
				i = j;
			}
		};
		var tet = document.getElementById("textarea").value;
		var todos = this.props.todos;
		todos[i].detail = tet;
		this.props.replace(todos);
		todos.map(function(todo){
			todo.click = false;
		});
		this.refs.content.value = '';
	},

	saveAttr: function(e){
		e.preventDefault();
		var i = -1;
		for (let j = 0; j < this.props.todos.length; j++) {
			if(this.props.todos[j].click === true){
				i = j;
			}
		};
		// alert("i = "+i);
		var tet = document.getElementById("textarea").value;
		var dat = this.refs.date.value.trim();
		var pri = this.refs.priority.value.trim();
		// alert(dat);
		var todos = this.props.todos;
		// var data_real = todos[i].expired_date;
		// alert(data_real);
		if (dat !== ''){
			todos[i].expired_date = dat;
		}
		if (pri !== ''){
			todos[i].priority = pri;
		}
		todos[i].detail = tet;
		this.props.replace(todos);
		todos.map(function(todo){
			todo.click = false;
		});
	},

	render: function(){
		return(
			<ul id="todo-list">
			{
				this.props.todos.map(function(todo,i){
					if(todo.start_date){
						var start_date = todo.start_date;
					}
					else{
						var start_date = "今天";
					}
					// alert(start_date);
					if(todo.completed===true && todo.click===true){
						return (
							<li className="content">
								<s>{todo.title}</s>
								<span className="del" onClick={this.delContent} data-index={i}>删除</span>
								<span className="del" onClick={this.clickTodo} data-index={i}>查看详情</span>
								<div>
									<Detail detail={todo.detail} saveContent={this.saveDetail} />
									<form className="form">
										<label> 开始:{start_date} 截止 </label>
										<input type="date" ref="date" placeholder={todo.expired_date} id="txtDate" size="10" />
										<label> 优先级 </label>
										<input type="date" ref="priority" placeholder={todo.priority} id="priority" size="2" />
									</form>
								</div>
							</li>
						);
					}
					else if(todo.completed===true && todo.click===false){
						return (
							<li className="content">
								<s>{todo.title}</s>
								<span className="del" onClick={this.delContent} data-index={i}>删除</span>
								<span className="del" onClick={this.clickTodo} data-index={i}>查看详情</span>
							</li>
						);
					}
					else if(todo.completed===false && todo.click===true){
						return(
							<li className="content">
								<label>{todo.title}</label>
								<span className="del" onClick={this.delContent} data-index={i}>删除</span>
								<span className="del" onClick={this.completeContent} data-index={i}>完成</span>
								<span className="del" onClick={this.clickTodo} data-index={i}>查看详情</span>
								<div>
									<Detail detail={todo.detail} saveContent={this.saveAttr} />
									<form className="form">
										<label> 开始:{start_date} 截止 </label>
										<input type="date" ref="date" placeholder={todo.expired_date} id="txtDate" size="10" />
										<label> 优先级 </label>
										<input type="date" ref="priority" placeholder={todo.priority} id="priority" size="2" />
									</form>
								</div>
							</li>
						);
					}
					else{
						return(
							<li className="content">
								<label>{todo.title}</label>
								<span className="del" onClick={this.delContent} data-index={i}>删除</span>
								<span className="del" onClick={this.completeContent} data-index={i}>完成</span>
								<span className="del" onClick={this.clickTodo} data-index={i}>查看详情</span>
							</li>
						);
					}
				}.bind(this))
			}
			</ul>
		);
	}
})

d1 = document.getElementById('container')
d1.style.cssText += 'text-align:center'
ReactDOM.render(<TodosList url='/todolist/' pollInterval={600000} />, d1)
