function requestsProcess() {
  // хинт
  tippy('.request__hint', {
    content: 'Реплицированные с зарубежных источников, исследования формируют глобальную сеть.',
    allowHTML: true,
    interactive: true,
    theme: 'main',
    maxWidth: 157
  });

  const inputFio = document.querySelector('.input-fio');
  const inputsPhone = document.querySelectorAll('.input-phone');
  const inputEmail = document.querySelector('.input-email');

  for (let inputPhone of inputsPhone) {
    // маски ввода
    Inputmask({ mask: '+7 (999) 999-99-99' }).mask(inputPhone);

    // валидация
    if (document.getElementById('request-form')) {
      const validation = new JustValidate('#request-form', {
        focusInvalidField: true,
        validateBeforeSubmitting: true,
        // errorsContainer: document.getElementById('client-error'),
        errorFieldCssClass: 'invalidated',
      })
        .addField('#request-fio', [
          {
            rule: 'required',
            errorMessage: 'Введите ФИО',
          }
        ])
        .addField('#request-phone', [
          {
            rule: 'required',
            errorMessage: `Введите номер`,
          },
          {
            validator: function (value, context) {
              const numValue = inputPhone.inputmask.unmaskedvalue();
              return Boolean(Number(numValue) && numValue.length === 10);
            },
            errorMessage: 'Некорректный номер',
          },
        ])
        .addField('#request-email', [
          {
            rule: 'required',
            errorMessage: 'Введите e-mail',
          },
          {
            rule: 'email',
            errorMessage: 'Неправильный формат',
          }
        ]);

      // validation.revalidate();
    }
  }
}
