function formatDatesToOrdinal(dateInputs) {
    const ordinalSuffix = (n) => {
        if (n > 3 && n < 21) return 'th'; // Covers special case 4-20
        switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const formatDate = (dateInput) => {
        const date = new Date(dateInput);

        if (isNaN(date)) {
            throw new Error(`Invalid date input: ${dateInput}`);
        }

        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        let formattedDate = date.toLocaleDateString('en-US', options);

        const day = date.getDate();
        formattedDate = formattedDate.replace(
            `${day}`,
            `${day}${ordinalSuffix(day)}`
        );

        return formattedDate;
    };

    if (!Array.isArray(dateInputs)) {
        throw new Error("Input must be an array of dates.");
    }

    return dateInputs.map(formatDate);
}


module.exports=formatDatesToOrdinal