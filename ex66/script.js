fetch('student.xml')
    .then(response => response.text())
    .then(xmlText => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, "text/xml");
        const student = doc.getElementsByTagName("student")[0];
        const id = student.getAttribute("id");
        const name = student.getElementsByTagName("name")[0].textContent;
        const birthday = student.getElementsByTagName("birthday")[0].textContent;
        const gender = student.getElementsByTagName("gender")[0].textContent;
        const table = document.getElementById("infoTable");
        const rows = [
            ["Student ID:", id],
            ["Student Name:", name],
            ["Birthday:", birthday],
            ["Gender:", gender]
        ];

        rows.forEach(rowData => {
            const row = table.insertRow();
            row.insertCell(0).textContent = rowData[0];
            row.insertCell(1).textContent = rowData[1];
        });
    })
    .catch(error => console.error('Lỗi r mẹ ơi:', error));