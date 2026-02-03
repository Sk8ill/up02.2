// Инициализация данных приложения
let currentRole = 'store-manager';
let tasks = [
    { id: 1, name: 'Замена освещения в торговом зале', store: 'Магазин №1', startDate: '2023-10-20', endDate: '2023-10-25', description: 'Требуется замена 30 светильников на энергосберегающие', priority: 'high', status: 'new', assignedSpecialists: [] },
    { id: 2, name: 'Ремонт системы кондиционирования', store: 'Магазин №2', startDate: '2023-10-18', endDate: '2023-10-19', description: 'Неисправность в основном блоке кондиционера', priority: 'urgent', status: 'in-progress', assignedSpecialists: [] },
    { id: 3, name: 'Обновление POS-терминалов', store: 'Магазин №3', startDate: '2023-10-22', endDate: '2023-10-24', description: 'Обновление программного обеспечения на 5 терминалах', priority: 'normal', status: 'completed', assignedSpecialists: [1, 2] },
    { id: 4, name: 'Установка дополнительных камер видеонаблюдения', store: 'Магазин №1', startDate: '2023-10-28', endDate: '2023-10-30', description: 'Установка 4 камер в складском помещении', priority: 'normal', status: 'new', assignedSpecialists: [] },
    { id: 5, name: 'Покраска фасада здания', store: 'Магазин №4', startDate: '2023-11-01', endDate: '2023-11-05', description: 'Полная покраска фасада магазина', priority: 'high', status: 'cancelled', assignedSpecialists: [] }
];

let specialists = [
    { id: 1, name: 'Иванов А.С.', skills: ['Электрик', 'Освещение'], available: true },
    { id: 2, name: 'Петров В.И.', skills: ['IT-специалист', 'POS-системы'], available: true },
    { id: 3, name: 'Сидоров М.П.', skills: ['Кондиционирование', 'Вентиляция'], available: false },
    { id: 4, name: 'Кузнецова О.Л.', skills: ['Видеонаблюдение', 'Безопасность'], available: true },
    { id: 5, name: 'Николаев Д.В.', skills: ['Маляр', 'Фасадные работы'], available: true },
    { id: 6, name: 'Федорова Е.С.', skills: ['Сантехник', 'Отопление'], available: true }
];

let statusHistory = [
    { taskId: 1, date: '2023-10-14 10:30', user: 'Управляющий магазином №1', from: null, to: 'new' },
    { taskId: 2, date: '2023-10-12 09:15', user: 'Управляющий магазином №2', from: null, to: 'new' },
    { taskId: 2, date: '2023-10-13 14:20', user: 'Управляющий магазином №2', from: 'new', to: 'in-progress' },
    { taskId: 3, date: '2023-10-10 11:00', user: 'Управляющий магазином №3', from: null, to: 'new' },
    { taskId: 3, date: '2023-10-11 16:45', user: 'Управляющий магазином №3', from: 'new', to: 'in-progress' },
    { taskId: 3, date: '2023-10-12 10:30', user: 'Управляющий офисом', from: 'in-progress', to: 'completed' }
];

// DOM элементы
let currentTaskIdForAssignment = null;

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    setupRoleSwitching();
    setupNavigation();
    setupEventListeners();
    updateCurrentDate();
    renderTasks();
    renderNavigation();
});

// Функции
function setupRoleSwitching() {
    const roleBadges = document.querySelectorAll('.role-badge');
    roleBadges.forEach(badge => {
        badge.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            switchRole(role);
        });
    });
}

function switchRole(role) {
    currentRole = role;
    
    // Обновление активной роли в UI
    const roleBadges = document.querySelectorAll('.role-badge');
    roleBadges.forEach(badge => {
        badge.classList.remove('active');
        if (badge.getAttribute('data-role') === role) {
            badge.classList.add('active');
        }
    });
    
    // Обновление текста текущей роли
    let roleText = '';
    switch(role) {
        case 'store-manager': roleText = 'Управляющий магазином'; break;
        case 'office-manager': roleText = 'Управляющий офисом'; break;
        case 'hr-specialist': roleText = 'Специалист HR'; break;
    }
    document.getElementById('current-role').textContent = roleText;
    
    // Показ/скрытие соответствующих областей контента
    const contentAreas = {
        'store-manager': document.getElementById('store-manager-content'),
        'office-manager': document.getElementById('office-manager-content'),
        'hr-specialist': document.getElementById('hr-specialist-content')
    };
    
    Object.keys(contentAreas).forEach(key => {
        if (key === role) {
            contentAreas[key].classList.remove('hidden');
        } else {
            contentAreas[key].classList.add('hidden');
        }
    });
    
    // Обновление навигации
    renderNavigation();
    renderTasks();
}

function renderNavigation() {
    const navList = document.getElementById('nav-list');
    navList.innerHTML = '';
    
    let navItems = [];
    
    switch(currentRole) {
        case 'store-manager':
            navItems = [
                { id: 'my-tasks', text: 'Мои задания', active: true },
                { id: 'create-task', text: 'Создать задание' },
                { id: 'drafts', text: 'Черновики' },
                { id: 'sent-tasks', text: 'Отправленные' }
            ];
            break;
            
        case 'office-manager':
            navItems = [
                { id: 'all-tasks', text: 'Все задания', active: true },
                { id: 'in-progress-tasks', text: 'В работе' },
                { id: 'urgent-tasks', text: 'Срочные' },
                { id: 'specialists', text: 'База специалистов' }
            ];
            break;
            
        case 'hr-specialist':
            navItems = [
                { id: 'recruitment-requests', text: 'Заявки на подбор', active: true },
                { id: 'active-tasks', text: 'Активные задания' },
                { id: 'specialists-db', text: 'База специалистов' },
                { id: 'reports', text: 'Отчёты' }
            ];
            break;
    }
    
    navItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        
        const a = document.createElement('a');
        a.href = '#';
        a.className = `nav-link ${item.active ? 'active' : ''}`;
        a.textContent = item.text;
        a.setAttribute('data-nav', item.id);
        
        a.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            // Здесь можно добавить обработку переключения разделов
        });
        
        li.appendChild(a);
        navList.appendChild(li);
    });
}

function setupEventListeners() {
    // Кнопка создания задания
    document.getElementById('create-task-btn').addEventListener('click', function() {
        document.getElementById('create-task-modal').classList.add('active');
        resetCreateForm();
    });
    
    // Закрытие модальных окон
    document.getElementById('close-create-modal').addEventListener('click', function() {
        document.getElementById('create-task-modal').classList.remove('active');
    });
    
    document.getElementById('close-edit-modal').addEventListener('click', function() {
        document.getElementById('edit-task-modal').classList.remove('active');
    });
    
    document.getElementById('close-assign-modal').addEventListener('click', function() {
        document.getElementById('assign-specialists-modal').classList.remove('active');
    });
    
    document.getElementById('close-history-modal').addEventListener('click', function() {
        document.getElementById('status-history-modal').classList.remove('active');
    });
    
    // Кнопки отмены
    document.getElementById('cancel-create-btn').addEventListener('click', function() {
        document.getElementById('create-task-modal').classList.remove('active');
    });
    
    document.getElementById('cancel-edit-btn').addEventListener('click', function() {
        document.getElementById('edit-task-modal').classList.remove('active');
    });
    
    document.getElementById('cancel-assign-btn').addEventListener('click', function() {
        document.getElementById('assign-specialists-modal').classList.remove('active');
    });
    
    document.getElementById('close-history-btn').addEventListener('click', function() {
        document.getElementById('status-history-modal').classList.remove('active');
    });
    
    // Форма создания задания
    document.getElementById('create-task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        createNewTask();
    });
    
    // Форма редактирования задания
    document.getElementById('edit-task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTaskChanges();
    });
    
    // Кнопка создания заявки в HR
    document.getElementById('request-hr-btn').addEventListener('click', function() {
        alert('Заявка на подбор персонала создана и отправлена специалисту HR');
        document.getElementById('assign-specialists-modal').classList.remove('active');
    });
    
    // Кнопка подтверждения назначения специалистов
    document.getElementById('confirm-assignment-btn').addEventListener('click', function() {
        const selectedSpecialists = document.querySelectorAll('.specialist-card.selected');
        if (selectedSpecialists.length > 0) {
            // Обновляем статус задания
            const taskIndex = tasks.findIndex(task => task.id === currentTaskIdForAssignment);
            if (taskIndex !== -1) {
                tasks[taskIndex].status = 'completed';
                
                // Добавляем специалистов к заданию
                selectedSpecialists.forEach(card => {
                    const specialistId = parseInt(card.getAttribute('data-id'));
                    if (!tasks[taskIndex].assignedSpecialists.includes(specialistId)) {
                        tasks[taskIndex].assignedSpecialists.push(specialistId);
                    }
                });
                
                // Добавляем запись в историю
                statusHistory.push({
                    taskId: currentTaskIdForAssignment,
                    date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}),
                    user: 'Управляющий офисом',
                    from: 'in-progress',
                    to: 'completed'
                });
                
                alert(`Назначено ${selectedSpecialists.length} специалистов на задание. Статус задания изменён на "Выполнен".`);
                document.getElementById('assign-specialists-modal').classList.remove('active');
                renderTasks();
            }
        } else {
            alert('Выберите хотя бы одного специалиста');
        }
    });
    
    // Кнопка просмотра истории статусов
    document.getElementById('view-history-btn').addEventListener('click', function() {
        showStatusHistory(3); // Показываем историю для задания с ID 3
    });
    
    // Фильтрация специалистов
    document.getElementById('specialist-search').addEventListener('input', function() {
        renderSpecialists(currentTaskIdForAssignment);
    });
    
    document.getElementById('availability-filter').addEventListener('change', function() {
        renderSpecialists(currentTaskIdForAssignment);
    });
}

function resetCreateForm() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('start-date').value = today;
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    document.getElementById('end-date').value = nextWeek.toISOString().split('T')[0];
    
    document.getElementById('task-name').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-priority').value = 'normal';
}

function createNewTask() {
    const taskName = document.getElementById('task-name').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const description = document.getElementById('task-description').value;
    const priority = document.getElementById('task-priority').value;
    
    // Создание нового задания
    const newTask = {
        id: tasks.length + 1,
        name: taskName,
        store: 'Магазин №1', // В реальном приложении это будет текущий магазин пользователя
        startDate: startDate,
        endDate: endDate,
        description: description,
        priority: priority,
        status: 'new',
        assignedSpecialists: []
    };
    
    tasks.push(newTask);
    document.getElementById('create-task-modal').classList.remove('active');
    renderTasks();
    
    // Добавление записи в историю статусов
    statusHistory.push({
        taskId: newTask.id,
        date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}),
        user: 'Управляющий магазином',
        from: null,
        to: 'new'
    });
    
    alert('Задание успешно создано со статусом "Новый"');
}

function saveTaskChanges() {
    const taskId = parseInt(document.getElementById('edit-task-id').value);
    const taskName = document.getElementById('edit-task-name').value;
    const startDate = document.getElementById('edit-start-date').value;
    const endDate = document.getElementById('edit-end-date').value;
    const description = document.getElementById('edit-task-description').value;
    const priority = document.getElementById('edit-task-priority').value;
    
    // Обновление задания
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].name = taskName;
        tasks[taskIndex].startDate = startDate;
        tasks[taskIndex].endDate = endDate;
        tasks[taskIndex].description = description;
        tasks[taskIndex].priority = priority;
        
        document.getElementById('edit-task-modal').classList.remove('active');
        renderTasks();
        alert('Изменения сохранены');
    }
}

function updateCurrentDate() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    document.getElementById('current-date').textContent = `Дата: ${formattedDate}`;
}

function renderTasks() {
    // Очищаем таблицы
    const storeTable = document.getElementById('store-tasks-table').querySelector('tbody');
    const officeTable = document.getElementById('office-tasks-table').querySelector('tbody');
    const hrTable = document.getElementById('hr-tasks-table').querySelector('tbody');
    
    storeTable.innerHTML = '';
    officeTable.innerHTML = '';
    hrTable.innerHTML = '';
    
    // Рендерим задания для каждой роли
    tasks.forEach(task => {
        const row = createTaskRow(task);
        
        // Для управляющего магазином показываем все его задания
        if (task.store === 'Магазин №1' || task.store === 'Магазин №2') {
            storeTable.appendChild(row.cloneNode(true));
        }
        
        // Для управляющего офисом показываем задания в работе
        if (task.status === 'in-progress' || task.status === 'new') {
            officeTable.appendChild(row.cloneNode(true));
        }
        
        // Для HR показываем выполненные задания и задания с заявками на подбор
        if (task.status === 'completed' || task.status === 'in-progress') {
            hrTable.appendChild(row.cloneNode(true));
        }
    });
}

function createTaskRow(task) {
    const row = document.createElement('tr');
    
    // Форматируем даты
    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('ru-RU');
    };
    
    const startDate = formatDate(task.startDate);
    const endDate = formatDate(task.endDate);
    
    // Определяем текст статуса
    let statusText = '';
    let statusClass = '';
    switch(task.status) {
        case 'new': statusText = 'Новый'; statusClass = 'status-new'; break;
        case 'in-progress': statusText = 'В работе'; statusClass = 'status-in-progress'; break;
        case 'completed': statusText = 'Выполнен'; statusClass = 'status-completed'; break;
        case 'cancelled': statusText = 'Отменён'; statusClass = 'status-cancelled'; break;
        case 'closed': statusText = 'Закрыт'; statusClass = 'status-closed'; break;
    }
    
    // Создаем ячейки
    const idCell = document.createElement('td');
    idCell.textContent = task.id;
    
    const nameCell = document.createElement('td');
    nameCell.textContent = task.name;
    
    const storeCell = document.createElement('td');
    storeCell.textContent = task.store;
    
    const datesCell = document.createElement('td');
    datesCell.textContent = `${startDate} - ${endDate}`;
    
    const statusCell = document.createElement('td');
    const statusBadge = document.createElement('span');
    statusBadge.className = `status-badge ${statusClass}`;
    statusBadge.textContent = statusText;
    statusCell.appendChild(statusBadge);
    
    const actionsCell = document.createElement('td');
    actionsCell.className = 'action-buttons';
    
    // Добавляем кнопки действий в зависимости от роли и статуса
    if (currentRole === 'store-manager') {
        if (task.status === 'new') {
            // Кнопка редактирования
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-small btn-warning';
            editBtn.textContent = 'Редактировать';
            editBtn.addEventListener('click', () => openEditModal(task.id));
            actionsCell.appendChild(editBtn);
            
            // Кнопка отправки
            const sendBtn = document.createElement('button');
            sendBtn.className = 'btn btn-small btn-primary';
            sendBtn.textContent = 'Отправить';
            sendBtn.addEventListener('click', () => sendTaskToOffice(task.id));
            actionsCell.appendChild(sendBtn);
            
            // Кнопка отмены
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-small btn-danger';
            cancelBtn.textContent = 'Отменить';
            cancelBtn.addEventListener('click', () => cancelTask(task.id));
            actionsCell.appendChild(cancelBtn);
        } else if (task.status === 'in-progress') {
            // Только кнопка отмены для заданий в работе
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'btn btn-small btn-danger';
            cancelBtn.textContent = 'Отменить';
            cancelBtn.addEventListener('click', () => cancelTask(task.id));
            actionsCell.appendChild(cancelBtn);
        }
    } else if (currentRole === 'office-manager' && task.status === 'in-progress') {
        // Кнопка назначения специалистов
        const assignBtn = document.createElement('button');
        assignBtn.className = 'btn btn-small btn-success';
        assignBtn.textContent = 'Назначить';
        assignBtn.addEventListener('click', () => openAssignSpecialistsModal(task.id));
        actionsCell.appendChild(assignBtn);
    } else if (currentRole === 'hr-specialist' && task.status === 'completed') {
        // Кнопка закрытия задания
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn-small btn-primary';
        closeBtn.textContent = 'Закрыть';
        closeBtn.addEventListener('click', () => closeTask(task.id));
        actionsCell.appendChild(closeBtn);
        
        // Кнопка просмотра истории
        const historyBtn = document.createElement('button');
        historyBtn.className = 'btn btn-small btn-secondary';
        historyBtn.textContent = 'История';
        historyBtn.addEventListener('click', () => showStatusHistory(task.id));
        actionsCell.appendChild(historyBtn);
    }
    
    // Добавляем ячейки в строку
    row.appendChild(idCell);
    
    if (currentRole === 'office-manager' || currentRole === 'hr-specialist') {
        row.appendChild(storeCell);
    }
    
    row.appendChild(nameCell);
    row.appendChild(datesCell);
    row.appendChild(statusCell);
    row.appendChild(actionsCell);
    
    return row;
}

function openEditModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status === 'new') {
        document.getElementById('edit-task-id').value = task.id;
        document.getElementById('edit-task-name').value = task.name;
        document.getElementById('edit-start-date').value = task.startDate;
        document.getElementById('edit-end-date').value = task.endDate;
        document.getElementById('edit-task-description').value = task.description || '';
        document.getElementById('edit-task-priority').value = task.priority || 'normal';
        
        document.getElementById('edit-task-modal').classList.add('active');
    }
}

function openAssignSpecialistsModal(taskId) {
    currentTaskIdForAssignment = taskId;
    renderSpecialists(taskId);
    document.getElementById('assign-specialists-modal').classList.add('active');
}

function renderSpecialists(taskId) {
    const specialistsList = document.getElementById('specialists-list');
    const searchTerm = document.getElementById('specialist-search').value.toLowerCase();
    const availabilityFilter = document.getElementById('availability-filter').value;
    
    specialistsList.innerHTML = '';
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    // Фильтруем специалистов
    const filteredSpecialists = specialists.filter(specialist => {
        // Поиск по имени и навыкам
        const matchesSearch = searchTerm === '' || 
            specialist.name.toLowerCase().includes(searchTerm) ||
            specialist.skills.some(skill => skill.toLowerCase().includes(searchTerm));
        
        // Фильтр по доступности
        const matchesAvailability = availabilityFilter === 'all' || 
            (availabilityFilter === 'available' && specialist.available);
        
        return matchesSearch && matchesAvailability;
    });
    
    // Отображаем специалистов
    filteredSpecialists.forEach(specialist => {
        const card = document.createElement('div');
        card.className = 'specialist-card';
        card.setAttribute('data-id', specialist.id);
        
        // Проверяем, назначен ли уже этот специалист на задание
        const isAssigned = task.assignedSpecialists && task.assignedSpecialists.includes(specialist.id);
        if (isAssigned) {
            card.classList.add('selected');
        }
        
        card.innerHTML = `
            <div class="specialist-name">${specialist.name}</div>
            <div>${specialist.available ? '✅ Доступен' : '❌ Недоступен'}</div>
            <div style="margin-top: 10px;">
                ${specialist.skills.map(skill => `<span class="specialist-skill">${skill}</span>`).join('')}
            </div>
        `;
        
        card.addEventListener('click', function() {
            if (!specialist.available && availabilityFilter === 'available') return;
            
            this.classList.toggle('selected');
        });
        
        specialistsList.appendChild(card);
    });
    
    if (filteredSpecialists.length === 0) {
        specialistsList.innerHTML = '<p>Специалисты не найдены. Попробуйте изменить критерии поиска.</p>';
    }
}

function sendTaskToOffice(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1 && tasks[taskIndex].status === 'new') {
        tasks[taskIndex].status = 'in-progress';
        
        // Добавляем запись в историю
        statusHistory.push({
            taskId: taskId,
            date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}),
            user: 'Управляющий магазином',
            from: 'new',
            to: 'in-progress'
        });
        
        renderTasks();
        alert('Задание отправлено в центральный офис. Статус изменён на "В работе".');
    }
}

function cancelTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1 && (tasks[taskIndex].status === 'new' || tasks[taskIndex].status === 'in-progress')) {
        tasks[taskIndex].status = 'cancelled';
        
        // Добавляем запись в историю
        statusHistory.push({
            taskId: taskId,
            date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}),
            user: 'Управляющий магазином',
            from: tasks[taskIndex].status === 'new' ? 'new' : 'in-progress',
            to: 'cancelled'
        });
        
        renderTasks();
        alert('Задание отменено.');
    }
}

function closeTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1 && tasks[taskIndex].status === 'completed') {
        tasks[taskIndex].status = 'closed';
        
        // Добавляем запись в историю
        statusHistory.push({
            taskId: taskId,
            date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'}),
            user: 'Специалист HR',
            from: 'completed',
            to: 'closed'
        });
        
        renderTasks();
        alert('Задание закрыто.');
    }
}

function showStatusHistory(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    document.getElementById('history-task-id').textContent = taskId;
    
    const timeline = document.getElementById('status-history-timeline');
    timeline.innerHTML = '';
    
    // Фильтруем историю по ID задания
    const taskHistory = statusHistory.filter(record => record.taskId === taskId);
    
    if (taskHistory.length === 0) {
        timeline.innerHTML = '<p>История статусов отсутствует.</p>';
    } else {
        // Сортируем по дате (от старых к новым)
        taskHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        taskHistory.forEach(record => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            const fromStatus = record.from ? getStatusText(record.from) : '—';
            const toStatus = getStatusText(record.to);
            
            timelineItem.innerHTML = `
                <div class="timeline-content">
                    <div class="timeline-date">${record.date}</div>
                    <div><strong>Пользователь:</strong> ${record.user}</div>
                    <div><strong>Изменение статуса:</strong> ${fromStatus} → ${toStatus}</div>
                </div>
            `;
            
            timeline.appendChild(timelineItem);
        });
    }
    
    document.getElementById('status-history-modal').classList.add('active');
}

function getStatusText(statusCode) {
    switch(statusCode) {
        case 'new': return 'Новый';
        case 'in-progress': return 'В работе';
        case 'completed': return 'Выполнен';
        case 'cancelled': return 'Отменён';
        case 'closed': return 'Закрыт';
        default: return statusCode;
    }
}