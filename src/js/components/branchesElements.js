function branchesProcess() {
    // регионы
    const branches = document.querySelectorAll('.branches__list');
    branches.forEach(branch => {
      const choices = new Choices(branch, {
        searchEnabled: false,
        shouldSort: false,
        itemSelectText: '',
        allowHTML: true,
        // position: 'down',
        choices: [
          { value: 'Москва', label: 'Москва', selected: true, disabled: false },
          { value: 'Казань', label: 'Казань' },
          { value: 'Уфа', label: 'Уфа' },
          { value: 'Пермь', label: 'Пермь' },
        ],
      });
    });
}
