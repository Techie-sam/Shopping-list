document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('item-form');
    const input = document.getElementById('item-input');
    const priceInput = document.getElementById('price-input');
    const list = document.getElementById('shopping-list');
    const categorySelect = document.getElementById('category-select');
    const itemCount = document.getElementById('item-count');
    const priceTotal = document.getElementById('price-total');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Initialisation du drag and drop
    new Sortable(list, {
        animation: 150,
        handle: '.drag-handle',
        onEnd: saveToLocalStorage
    });

    // Charger les items sauvegardés
    loadFromLocalStorage();
    updateItemCount();
    updateTotalPrice();

    // Ajout d'items
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemText = input.value.trim();
        const price = parseFloat(priceInput.value) || 0;
        const category = categorySelect.value;
        
        if (itemText !== '') {
            addItemToList(itemText, category, false, price);
            input.value = '';
            priceInput.value = '';
            categorySelect.value = 'autres';
            saveToLocalStorage();
        }
    });

    // Gérer les filtres
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterItems(button.id);
        });
    });

    function addItemToList(itemText, category, completed = false, price = 0) {
        const li = document.createElement('li');
        if (completed) li.classList.add('completed');
        
        const itemContent = document.createElement('div');
        itemContent.className = 'item-content';
        
        // Ajout icône de drag
        const dragHandle = document.createElement('span');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '<i class="fas fa-grip-vertical"></i>';
        
        // Ajout checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox';
        checkbox.checked = completed;
        
        // Ajout le texte
        const textSpan = document.createElement('span');
        textSpan.className = 'item-text';
        textSpan.textContent = itemText;
        
        // Ajout catégorie
        const categoryTag = document.createElement('span');
        categoryTag.className = 'category-tag';
        categoryTag.textContent = category;

        // Ajout prix
        const priceTag = document.createElement('span');
        priceTag.className = 'price-tag';
        priceTag.textContent = price.toFixed(2) + ' €';
        
        // Btn de suppression
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';
        
        // Assemblage des éléments
        itemContent.appendChild(dragHandle);
        itemContent.appendChild(checkbox);
        itemContent.appendChild(textSpan);
        itemContent.appendChild(categoryTag);
        itemContent.appendChild(priceTag);
        li.appendChild(itemContent);
        li.appendChild(deleteBtn);
        
        // Ajout Evénements
        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed');
            saveToLocalStorage();
        });
        
        deleteBtn.addEventListener('click', () => {
            list.removeChild(li);
            saveToLocalStorage();
            updateItemCount();
            updateTotalPrice();
        });
        
        list.appendChild(li);
        updateItemCount();
        updateTotalPrice();
    }

    function filterItems(filterId) {
        const items = list.querySelectorAll('li');
        items.forEach(item => {
            switch(filterId) {
                case 'show-active':
                    item.style.display = item.classList.contains('completed') ? 'none' : '';
                    break;
                case 'show-completed':
                    item.style.display = item.classList.contains('completed') ? '' : 'none';
                    break;
                default:
                    item.style.display = '';
            }
        });
    }

    function saveToLocalStorage() {
        const items = [];
        list.querySelectorAll('li').forEach(li => {
            const priceText = li.querySelector('.price-tag').textContent;
            const price = parseFloat(priceText) || 0;
            items.push({
                text: li.querySelector('.item-text').textContent,
                category: li.querySelector('.category-tag').textContent,
                completed: li.classList.contains('completed'),
                price: price
            });
        });
        localStorage.setItem('shoppingList', JSON.stringify(items));
        updateTotalPrice();
    }

    function loadFromLocalStorage() {
        const items = JSON.parse(localStorage.getItem('shoppingList')) || [];
        items.forEach(item => {
            addItemToList(item.text, item.category, item.completed, item.price);
        });
    }

    function updateItemCount() {
        const count = list.querySelectorAll('li').length;
        itemCount.textContent = count;
    }

    function updateTotalPrice() {
        let total = 0;
        list.querySelectorAll('.price-tag').forEach(priceTag => {
            const price = parseFloat(priceTag.textContent) || 0;
            total += price;
        });
        priceTotal.textContent = total.toFixed(2);
    }
});