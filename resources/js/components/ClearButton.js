import React from 'react';
const ClearButton = (props) => {

    return (
        <button type="button" className="btn btn-dark w-100 mt-4"
            onClick={() => {
                props.fetching(true)
                fetch(props.url)
                    .then(res => res.json())
                    .catch(error => console.error('Error:', error))
                    .then(response => { props.callback(response) })
            }
            }
        >
            Limpiar busqueda
    </button>
    )
}

export default ClearButton;