document.addEventListener('DOMContentLoaded', function () {
  const editableElements = document.querySelectorAll('header, h1, p, span, li');

  editableElements.forEach((element) => {
    element.setAttribute('contenteditable', 'true');

    element.addEventListener('focus', function () {
      this.classList.add('editing');
    });

    element.addEventListener('blur', function () {
      this.classList.remove('editing');
    });
  });

  function saveResumeData() {
    const dataToSave = {};

    editableElements.forEach((el, index) => {
      dataToSave[`editable-${index}`] = {
        html: el.innerHTML,
        id: el.id || null,
        class: el.className || null,
      };
    });

    localStorage.setItem('resumeData', JSON.stringify(dataToSave));
    alert('Данные сохранены!');
  }

  function loadResumeData() {
    const savedData = localStorage.getItem('resumeData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);

      editableElements.forEach((el, index) => {
        const savedEl = parsedData[`editable-${index}`];
        if (savedEl) el.innerHTML = savedEl.html;
      });
    }
  }

  loadResumeData();

  const saveButton = document.getElementById('saveBtn');
  if (saveButton) {
    saveButton.addEventListener('click', saveResumeData);
  }

  const script = document.createElement('script');
  script.src =
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
  script.onload = function () {
    const pdfButton = document.getElementById('pdfBtn');
    if (pdfButton) {
      pdfButton.addEventListener('click', generatePDF);
    }
  };
  document.head.appendChild(script);

  // function generatePDF() {
  // const element = document.querySelector('.container');
  // const opt = {
  //     margin: [5, 5, 5, 5],
  //     filename: 'resume.pdf',
  //     image: { type: 'jpeg', quality: 0.98 },

  //     html2canvas: {
  //         scale: 1,
  //         width: 595,
  //         height: element.scrollHeight,
  //         scrollY: 0,
  //         windowHeight: document.querySelector('.container').scrollHeight,
  //         allowTaint: true,
  //         useCORS: true,
  //         logging: false,
  //     },
  //     jsPDF: {
  //         unit: 'mm',
  //         format: 'a4',
  //         orientation: 'portrait',
  //         hotfixes: ['px_scaling']
  //     }
  // };

  // const saveBtn = document.getElementById('saveBtn');
  // const pdfBtn = document.getElementById('pdfBtn');
  // if (saveBtn) saveBtn.style.display = 'none';
  // if (pdfBtn) pdfBtn.style.display = 'none';

  // document.body.classList.add('generating-pdf');

  // html2pdf().set(opt).from(element).save().then(() => {
  //     if (saveBtn) saveBtn.style.display = 'block';
  //     if (pdfBtn) pdfBtn.style.display = 'block';
  //     document.body.classList.remove('generating-pdf');
  // });
  // }

  function generatePDF() {
    const element = document.querySelector('.container');
    const opt = {
      margin: [5, 5, 5, 5],
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 1,
        width: 595, // Фиксированная ширина A4 в пикселях (210mm при 72dpi)
        height: element.scrollHeight,
        scrollY: 0,
        windowHeight: element.scrollHeight,
        allowTaint: true,
        useCORS: true,
        logging: false,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
        hotfixes: ['px_scaling'],
      },
    };

    // Скрываем кнопки перед генерацией PDF
    const saveBtn = document.getElementById('saveBtn');
    const pdfBtn = document.getElementById('pdfBtn');
    const clearBtn = document.getElementById('clearBtn');
    if (saveBtn) saveBtn.style.display = 'none';
    if (pdfBtn) pdfBtn.style.display = 'none';
    if (clearBtn) clearBtn.style.display = 'none';

    // Добавляем класс для стилизации во время генерации
    document.body.classList.add('generating-pdf');

    // Временно изменяем стили для корректной генерации
    const originalStyles = {
      width: element.style.width,
      maxWidth: element.style.maxWidth,
      padding: element.style.padding,
    };

    element.style.width = '595px';
    element.style.maxWidth = 'none';
    element.style.padding = '0';

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        // Восстанавливаем оригинальные стили
        element.style.width = originalStyles.width;
        element.style.maxWidth = originalStyles.maxWidth;
        element.style.padding = originalStyles.padding;

        // Показываем кнопки обратно
        if (saveBtn) saveBtn.style.display = 'block';
        if (pdfBtn) pdfBtn.style.display = 'block';
        if (clearBtn) clearBtn.style.display = 'block';
        document.body.classList.remove('generating-pdf');
      });
  }

  const clearButton = document.getElementById('clearBtn');
  if (clearButton) {
    clearButton.addEventListener('click', clearResumeData);
  }

  function clearResumeData() {
    if (confirm('Are you sure you want to clear all saved data?')) {
      localStorage.removeItem('resumeData');
      location.reload();
      alert('All saved data has been cleared!');
    }
  }
});
