function categoriesProcess() {
    // категории
    const categories = document.querySelectorAll('.categories__list');
    categories.forEach(category => {
      const choices = new Choices(category, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        allowHTML: true,
        // position: 'down',
        choices: [
          { value: 'empty', label: 'Категория', selected: true, disabled: true },
          { value: 'Диваны', label: 'Диваны' },
          { value: 'Кресла', label: 'Кресла' },
          { value: 'Пуфы', label: 'Пуфы' },
          { value: 'Кровати', label: 'Кровати' },
          { value: 'Тумбы', label: 'Тумбы' },
          { value: 'Комоды', label: 'Комоды' },
          { value: 'Стулья', label: 'Стулья' },
          { value: 'Столы', label: 'Столы' },
          { value: 'Аксессуары', label: 'Аксессуары' },
        ],
      });
    });
}
