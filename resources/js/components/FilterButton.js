import React from 'react';
const setValue = (id, json) => {
    let input = document.getElementById(id).value
    input = input.replace("/", "-----")
    if (input != "") {
        input = json["operator"] == "LIKE" ? `${input}+=+` : input
        input = json["type"] == "text" ? `'${input}'` : input
    }
    return input
}
const FilterButton = (props) => {

    return (
        <button
            type="button"
            className={`${props.mounted ? 'btn-success' : 'btn-outline-secondary default-pointer'} w-100 mt-3 mb-2`}
            onClick={
                () => {
                    if (props.mounted) {
                        props.fetching(true)
                        let value = setValue(props.column, props.json)

                        let url = value ? `filtered/${props.url}/${props.json["column"]}/${value}/${props.json["operator"]}` : props.url

                        fetch(`/${url}`)
                            .then(res => res.json())
                            .catch(error => console.error('Error:', error))
                            .then(response => {
                                props.callback(response)
                            })
                    }
                }
            }
        >Buscar</button>
    )
}

export default FilterButton;
