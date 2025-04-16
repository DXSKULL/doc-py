let touristCount = 0;

function addTouristField() {
  const container = document.getElementById("tourists_fields");
  const touristDiv = document.createElement("div");
  touristDiv.className = "tourist-field";
  touristDiv.id = `tourist_${touristCount}`;

  const label = document.createElement("label");
  label.textContent = `ФИО туриста ${touristCount + 1}:`;
  const input = document.createElement("input");
  input.type = "text";
  input.name = `tourist_${touristCount}`;
  input.required = true;
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Убрать туриста";
  removeButton.onclick = () => removeTouristField(touristDiv.id);
  const br = document.createElement("br");

  touristDiv.appendChild(label);
  touristDiv.appendChild(input);
  touristDiv.appendChild(removeButton);
  touristDiv.appendChild(br);
  container.appendChild(touristDiv);

  touristCount++;
}

function removeTouristField(fieldId) {
  const field = document.getElementById(fieldId);
  field.remove();
  const fields = document.querySelectorAll(".tourist-field");
  fields.forEach((field, index) => {
    const label = field.querySelector("label");
    label.textContent = `ФИО туриста ${index + 1}:`;
    const input = field.querySelector("input");
    input.name = `tourist_${index}`;
    field.id = `tourist_${index}`;
  });
  touristCount = fields.length;
}

function handleKeyDown(event, input) {
  if (event.key === "Backspace") {
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    if (selectionStart !== selectionEnd) {
      return;
    }
    event.preventDefault();
    let value = input.value.replace(/[^0-9]/g, '');
    if (value.length > 0) {
      value = value.slice(0, -1);
      if (value.length === 0) {
        input.value = '';
      } else {
        formatDateInput(input, 'delete', value);
      }
    }
  }
}

function handleBeforeInput(event, input) {
  if (event.inputType === "deleteContentBackward" || event.inputType === "deleteContentForward") {
    event.preventDefault();
    let value = input.value.replace(/[^0-9]/g, '');
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    if (selectionStart === 0 && selectionEnd === input.value.length) {
      input.value = '';
      return;
    }

    let digits = value.split('');
    let digitIndexStart = 0;
    let digitIndexEnd = 0;
    let charCount = 0;
    for (let i = 0; i < input.value.length; i++) {
      if (/\d/.test(input.value[i])) {
        if (charCount < selectionStart) {
          digitIndexStart++;
        }
        if (charCount < selectionEnd) {
          digitIndexEnd++;
        }
        charCount++;
      } else {
        charCount++;
      }
    }

    if (digitIndexStart !== digitIndexEnd) {
      digits.splice(digitIndexStart, digitIndexEnd - digitIndexStart);
      value = digits.join('');
      if (value.length === 0) {
        input.value = '';
      } else {
        formatDateInput(input, 'delete', value);
      }
      let newCursorPos = 0;
      charCount = 0;
      for (let i = 0; i < input.value.length; i++) {
        if (/\d/.test(input.value[i])) {
          charCount++;
        }
        if (charCount >= digitIndexStart) {
          newCursorPos = i + 1;
          break;
        }
      }
      input.setSelectionRange(newCursorPos, newCursorPos);
    }
  } else if (event.inputType === "insertText" && input.selectionStart !== input.selectionEnd) {
    event.preventDefault();
    let value = input.value.replace(/[^0-9]/g, '');
    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;

    let digits = value.split('');
    let digitIndexStart = 0;
    let digitIndexEnd = 0;
    let charCount = 0;
    for (let i = 0; i < input.value.length; i++) {
      if (/\d/.test(input.value[i])) {
        if (charCount < selectionStart) {
          digitIndexStart++;
        }
        if (charCount < selectionEnd) {
          digitIndexEnd++;
        }
        charCount++;
      } else {
        charCount++;
      }
    }

    const newDigits = event.data.replace(/[^0-9]/g, '').split('');
    digits.splice(digitIndexStart, digitIndexEnd - digitIndexStart, ...newDigits);
    value = digits.join('');
    formatDateInput(input, 'input', value);

    let newCursorPos = 0;
    charCount = 0;
    let insertedDigits = newDigits.length;
    for (let i = 0; i < input.value.length; i++) {
      if (/\d/.test(input.value[i])) {
        charCount++;
      }
      if (charCount >= digitIndexStart + insertedDigits) {
        newCursorPos = i + 1;
        break;
      }
    }
    input.setSelectionRange(newCursorPos, newCursorPos);
  }
}

function formatDateInput(input, action, preValue = null) {
  let value = preValue || input.value.replace(/[^0-9]/g, '');
  let formatted = '';

  if (value.length > 0) {
    let day = value.substring(0, 2);
    if (day.length === 1 && parseInt(day) > 3 && action === 'input') {
      day = '0' + day;
    } else if (day.length === 2 && parseInt(day) > 31) {
      day = '31';
    }
    formatted = day;
  }

  if (value.length > 2) {
    let month = value.substring(2, 4);
    if (month.length === 1 && parseInt(month) > 1 && action === 'input') {
      month = '0' + month;
    } else if (month.length === 2 && parseInt(month) > 12) {
      month = '12';
    }
    formatted = formatted + '.' + month;
  }

  if (value.length > 4) {
    let year = value.substring(4, 8);
    if (action === 'input' && year.length === 2) {
      year = '20' + year;
    }
    formatted = formatted + '.' + year;
  }

  input.value = formatted;
}

function validateDates() {
  const startDateStr = document.getElementById("start_date").value;
  const endDateStr = document.getElementById("end_date").value;

  // Проверяем, что даты введены полностью (дд.мм.гггг)
  const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!dateRegex.test(startDateStr) || !dateRegex.test(endDateStr)) {
    alert("Пожалуйста, введите даты в формате дд.мм.гггг");
    return false;
  }

  // Парсим даты
  const [startDay, startMonth, startYear] = startDateStr.split('.').map(Number);
  const [endDay, endMonth, endYear] = endDateStr.split('.').map(Number);
  const startDate = new Date(startYear, startMonth - 1, startDay);
  const endDate = new Date(endYear, endMonth - 1, endDay);

  // Проверяем, что дата выезда не раньше даты заезда
  if (endDate < startDate) {
    alert("Дата выезда не может быть раньше даты заезда!");
    return false;
  }

  return true;
}

function calculateNights() {
  if (!validateDates()) {
    return;
  }

  const startDateStr = document.getElementById("start_date").value;
  const endDateStr = document.getElementById("end_date").value;

  const [startDay, startMonth, startYear] = startDateStr.split('.').map(Number);
  const [endDay, endMonth, endYear] = endDateStr.split('.').map(Number);
  const startDate = new Date(startYear, startMonth - 1, startDay);
  const endDate = new Date(endYear, endMonth - 1, endDay);

  // Вычисляем разницу в днях
  const timeDiff = endDate - startDate;
  const nights = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  document.getElementById("night_num").value = nights;
}