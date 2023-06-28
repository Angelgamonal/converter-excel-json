const inputContainer = document.getElementById('input');
const jsonTextArea = document.getElementById('json-data');
const downloadButton = document.querySelector('#dl-json');
let loadingTag = document.querySelector('#isLoading');

inputContainer.addEventListener('change', () => {
	const file = inputContainer.files[0];
	if (file) {
		getExcelRows(file);
	}
});

downloadButton.addEventListener('click', () => {
	const jsonString = jsonTextArea.value;

	downloadObjectAsJson(jsonString, 'excel_to');
});

const getExcelRows = async (fileData, startNumber = 0, batchSize = 100) => {
	try {
		loadingTag.style.display = 'initial';
		jsonTextArea.style.display = 'none';

		const data = await readXlsxFile(fileData);

		const headers = data[0];
		const resultArray = [];

		for (let i = startNumber + 1; i < data.length; i++) {
			const row = data[i];
			const temp = {};
			for (let j = 0; j < headers.length; j++) {
				temp[headers[j]] = row[j];
			}
			resultArray.push(temp);

			// Procesamiento por lotes
			if ((i - startNumber) % batchSize === 0) {
				await processBatch(resultArray);
			}
		}

		// Procesar las filas restantes
		await processBatch(resultArray);

		jsonTextArea.value = JSON.stringify(resultArray, null, 2);

		loadingTag.style.display = 'none';
		jsonTextArea.style.display = 'initial';
	} catch (error) {
		console.log('Error->', error);
	}
};

const processBatch = async (batch) => {
	// Realizar cualquier procesamiento adicional aquí
	// Ejemplo: enviar el lote a un servidor para su procesamiento

	// Simulación de retraso para mostrar el procesamiento en lotes
	await new Promise((resolve) => setTimeout(resolve, 100));
};

const downloadObjectAsJson = (str, filename) => {
	const data_str = 'data:text/json;charset=utf-8,' + encodeURIComponent(str);
	const anchor = document.createElement('a');
	anchor.setAttribute('href', data_str);
	anchor.setAttribute('download', filename + '.json');

	anchor.style.display = 'none';
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
};
