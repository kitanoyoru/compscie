package main

import "container/heap"

type (
	TaskManager struct {
		tasks map[int]*Task
		queue TaskQueue
	}

	TaskQueue []*Task

	Task struct {
		ID       int
		UserID   int
		Priority int
		index    int
	}
)

func (tq TaskQueue) Len() int { return len(tq) }

func (tq TaskQueue) Less(i, j int) bool {
	if tq[i].Priority == tq[j].Priority {
		return tq[i].ID > tq[j].ID
	}

	return tq[i].Priority > tq[j].Priority
}

func (tq TaskQueue) Swap(i, j int) {
	tq[i], tq[j] = tq[j], tq[i]
	tq[i].index = i
	tq[j].index = j
}

func (tq *TaskQueue) Push(x any) {
	task := x.(*Task)
	task.index = len(*tq)
	*tq = append(*tq, task)
}

func (tq *TaskQueue) Pop() any {
	old := *tq
	n := len(old)
	task := old[n-1]
	task.index = -1 // for safety
	*tq = old[0 : n-1]
	return task
}

func Constructor(tasks [][]int) TaskManager {
	tm := TaskManager{
		tasks: make(map[int]*Task),
		queue: TaskQueue{},
	}

	for _, t := range tasks {
		task := &Task{
			UserID:   t[0],
			ID:       t[1],
			Priority: t[2],
		}
		tm.tasks[task.ID] = task
		heap.Push(&tm.queue, task)
	}

	heap.Init(&tm.queue)

	return tm
}

func (this *TaskManager) Add(userId int, taskId int, priority int) {
	task := &Task{
		UserID:   userId,
		ID:       taskId,
		Priority: priority,
	}

	this.tasks[taskId] = task
	heap.Push(&this.queue, task)
}

func (this *TaskManager) Edit(taskId int, newPriority int) {
	if task, ok := this.tasks[taskId]; ok {
		task.Priority = newPriority
		heap.Fix(&this.queue, task.index)
	}
}

func (this *TaskManager) Rmv(taskId int) {
	if task, ok := this.tasks[taskId]; ok {
		heap.Remove(&this.queue, task.index)
		delete(this.tasks, taskId)
	}
}

func (this *TaskManager) ExecTop() int {
	if len(this.queue) == 0 {
		return -1
	}

	task := heap.Pop(&this.queue).(*Task)
	delete(this.tasks, task.ID)

	return task.UserID
}

/**
 * Your TaskManager object will be instantiated and called as such:
 * obj := Constructor(tasks);
 * obj.Add(userId,taskId,priority);
 * obj.Edit(taskId,newPriority);
 * obj.Rmv(taskId);
 * param_4 := obj.ExecTop();
 */
