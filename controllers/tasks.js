const Task = require('../models/task');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/users');
const AppError = require('../utils/appError');

const getAllTasks = catchAsync(async (req, res, next) => {
	const tasks = await Task.find({ createdBy: req.user.id });
	if (!tasks) {
		return next(new AppError('You have no pending tasks', 404));
	}
	res.status(200).json({ tasks });
});

const createTask = catchAsync(async (req, res) => {
	req.body.createdBy = req.user.id;
	if (req.body.taskType == 'group') {
		req.body.groupEmail = [req.user.email];
	}
	const task = await Task.create(req.body);
	res.status(201).json({ task });
});

const addToGroupTask = catchAsync(async (req, res, next) => {
	const groupTask = await Task.findOne({
		_id: req.params.id,
		createdBy: req.user.id,
		taskType: 'group',
	});
	if (!groupTask) {
		return next(
			new AppError(
				`you dont have any group task with id : ${req.params.id}`,
				400
			)
		);
	}

	if (req.user.groupEmail.includes(req.body.email)) {
		return next(
			new AppError(`User with email : ${req.params.email} already added`, 400)
		);
	}

	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new AppError(`no user with email : ${req.body.email}`, 400));
	}
	groupTask.groupEmail.push(req.body.email);
	groupTask.save({ validateBeforeSave: false });

	res.status(201).json({ groupTask });
});

const getGroupTask = catchAsync(async (req, res, next) => {
	const tasks = await Task.find({
		groupEmail: { $all: [req.user.email] },
	});
	if (!tasks) {
		return next(new AppError('You have no group tasks', 404));
	}
	res.status(200).json({ tasks });
});

const leaveGroupTask = catchAsync(async (req, res, next) => {
	const task = await Task.find({
		groupEmail: { $all: [req.user.email] }, 
        _id: req.params.id
	});
	if (!task) {
		return next(new AppError("You're not a memeber of this group", 404));
	}
    let index = task.groupEmail.indexOf(req.user.email)
    task.groupEmail.splice(index, 1)
	res.status(200).json({ task });
});

const getTask = catchAsync(async (req, res, next) => {
	const singleTask = await Task.findOne({
		_id: req.params.id,
		createdBy: req.user.id,
	});

	if (!singleTask) {
		return next(new AppError(`no task with id : ${req.params.id}`, 400));
	}
	res.status(200).json({ singleTask });
});

const updateTask = catchAsync(async (req, res, next) => {
	const updateTask = await Task.findOneAndUpdate(
		{ _id: req.params.id, createdBy: req.user.id },
		req.body,
		{
			new: true,
			runValidators: true,
		}
	);
	if (!updateTask) {
		return next(new AppError(`no task with id : ${req.params.id}`, 404));
	}
	res.status(200).json(updateTask);
});

const deleteTask = catchAsync(async (req, res, next) => {
	const deleteTask = await Task.findOneAndDelete({
		_id: req.params.id,
		createdBy: req.user.id,
	});

	if (!deleteTask) {
		return next(new AppError(`no task with id : ${req.params.id}`, 404));
	}
	res.status(200).json({ deleteTask });
});

const getTaskByStatus = catchAsync(async (req, res, next) => {
	if (!['todo', 'ongoing', 'completed'].includes(req.body.status)) {
		return next(new AppError(`Invalid status`, 404));
	}
	const tasks = await Task.find({
		createdBy: req.user.id,
		status: req.body.status,
	});
	if (!tasks) {
		return next(new AppError(`You have no ${req.body.status} tasks`, 404));
	}
	res.status(200).json({ tasks });
});

const changeTaskStatus = catchAsync(async (req, res, next) => {
	const singleTask = await Task.findOne({
		_id: req.params.id,
		createdBy: req.user.id,
	});

	if (!singleTask) {
		return next(new AppError(`no task with id : ${req.params.id}`, 404));
	}
	if (!['todo', 'ongoing', 'completed'].includes(req.body.status)) {
		return next(new AppError(`Invalid status`, 404));
	}
	singleTask.status = req.body.status;
	await singleTask.save({ validateBeforeSave: false });

	res.status(200).json({ singleTask });
});

module.exports = {
	getAllTasks,
	createTask,
	getTask,
	updateTask,
	deleteTask,
	getTaskByStatus,
	changeTaskStatus,
	addToGroupTask,
    getGroupTask,
    leaveGroupTask
};
