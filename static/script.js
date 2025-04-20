let touristCount = 0;
let roomCount = 0;

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

function addRoomField() {
  const container = document.getElementById("rooms_fields");
  const roomDiv = document.createElement("div");
  roomDiv.className = "room-field";
  roomDiv.id = `room_${roomCount}`;

  // Категория номера (число мест)
  const capacityLabel = document.createElement("label");
  capacityLabel.textContent = `Категория номера ${roomCount + 1} (число мест):`;
  const capacityInput = document.createElement("input");
  capacityInput.type = "number";
  capacityInput.name = `room_capacity_${roomCount}`;
  capacityInput.min = "1";
  capacityInput.required = true;
  const capacityBr = document.createElement("br");

  // Класс номера (Стандарт/Люкс)
  const classLabel = document.createElement("label");
  classLabel.textContent = `Класс номера ${roomCount + 1}:`;
  const classDiv = document.createElement("div");
  classDiv.className = "radio-group";
  
  const standardInput = document.createElement("input");
  standardInput.type = "radio";
  standardInput.name = `room_class_${roomCount}`;
  standardInput.value = "Стандарт";
  standardInput.required = true;
  standardInput.checked = true;
  const standardLabel = document.createElement("label");
  standardLabel.textContent = "Стандарт";
  standardLabel.style.marginRight = "15px";

  const luxeInput = document.createElement("input");
  luxeInput.type = "radio";
  luxeInput.name = `room_class_${roomCount}`;
  luxeInput.value = "Люкс";
  const luxeLabel = document.createElement("label");
  luxeLabel.textContent = "Люкс";

  classDiv.appendChild(standardInput);
  classDiv.appendChild(standardLabel);
  classDiv.appendChild(luxeInput);
  classDiv.appendChild(luxeLabel);
  const classBr = document.createElement("br");

  // Количество номеров
  const quantityLabel = document.createElement("label");
  quantityLabel.textContent = `Кол-во номеров ${roomCount + 1}:`;
  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.name = `room_quantity_${roomCount}`;
  quantityInput.min = "1";
  quantityInput.required = true;
  const quantityBr = document.createElement("br");

  // Кнопка "Удалить номер"
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.textContent = "Удалить номер";
  removeButton.onclick = () => removeRoomField(roomDiv.id);
  const removeBr = document.createElement("br");

  roomDiv.appendChild(capacityLabel);
  roomDiv.appendChild(capacityInput);
  roomDiv.appendChild(capacityBr);
  roomDiv.appendChild(classLabel);
  roomDiv.appendChild(classDiv);
  roomDiv.appendChild(classBr);
  roomDiv.appendChild(quantityLabel);
  roomDiv.appendChild(quantityInput);
  roomDiv.appendChild(quantityBr);
  roomDiv.appendChild(removeButton);
  roomDiv.appendChild(removeBr);
  container.appendChild(roomDiv);

  roomCount++;
}

function removeRoomField(fieldId) {
  const field = document.getElementById(fieldId);
  field.remove();
  const fields = document.querySelectorAll(".room-field");
  fields.forEach((field, index) => {
    const capacityLabel = field.querySelector("label:nth-child(1)");
    capacityLabel.textContent = `Категория номера ${index + 1} (число мест):`;
    const capacityInput = field.querySelector(`input[name^="room_capacity_"]`);
    capacityInput.name = `room_capacity_${index}`;

    const classLabel = field.querySelector("label:nth-child(4)");
    classLabel.textContent = `Класс номера ${index + 1}:`;
    const classInputs = field.querySelectorAll(`input[name^="room_class_"]`);
    classInputs.forEach(input => {
      input.name = `room_class_${index}`;
    });

    const quantityLabel = field.querySelector("label:nth-child(7)");
    quantityLabel.textContent = `Кол-во номеров ${index + 1}:`;
    const quantityInput = field.querySelector(`input[name^="room_quantity_"]`);
    quantityInput.name = `room_quantity_${index}`;

    field.id = `room_${index}`;
  });
  roomCount = fields.length;
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

  const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
  if (!dateRegex.test(startDateStr) || !dateRegex.test(endDateStr)) {
    alert("Пожалуйста, введите даты в формате дд.мм.гггг");
    return false;
  }

  const [startDay, startMonth, startYear] = startDateStr.split('.').map(Number);
  const [endDay, endMonth, endYear] = endDateStr.split('.').map(Number);
  const startDate = new Date(startYear, startMonth - 1, startDay);
  const endDate = new Date(endYear, endMonth - 1, endDay);

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

  const timeDiff = endDate - startDate;
  const nights = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  document.getElementById("night_num").value = nights;
}