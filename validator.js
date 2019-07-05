const titlePattern = /^[a-zA-Z() :.,!?&$']{2,400}$/;
const yearPattern = /^(1[8-9]\d\d|20[0-2]\d)$/;
const formatPattern = /^(VHS|DVD|Blu-Ray)$/i;

const isTitleValid = (value) => {
    return titlePattern.test(value);
}

const isYearValid = (value) => {
    return yearPattern.test(value);
}

const isFormatValid = (value) => {
    return formatPattern.test(value);
}


export function validate(movie) {
    let errors = {};

    if (!isTitleValid(movie.title)) errors.title = "Wrong format. Start with letter. 2-40 symbols";
    if (!isYearValid(movie.release_year)) errors.release_year = "Wrong year format";
    if (!isTitleValid(movie.stars)) errors.stars = "Wrong format. Start with letter. 2-40 symbols";

    if (movie.title === '') errors.title = "Can't be empty";
    if (movie.release_year === '') errors.release_year = "Can't be empty";
    if (movie.stars === '') errors.stars = "Can't be empty";


    const isValid = Object.keys(errors).length === 0;

    return { errors, isValid };
}
