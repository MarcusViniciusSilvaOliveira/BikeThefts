import 'whatwg-fetch'

export const EndPoints = {
    Get : (params) => {
        var _title = (params.title != "" && params.title != null) ? '&query='+ params.title : "";
        var _finalDate = (params.finalDate != "" && params.finalDate != null) ? '&occurred_before=' + params.finalDate : "";
        var _initialDate = (params.initialDate != "" && params.initialDate != null) ? '&occurred_after='+ params.initialDate : "";
        console.log(_initialDate);
        
        return fetch('https://bikewise.org:443/api/v2/incidents?page=1&per_page=1000'+ _initialDate + _finalDate +'&incident_type=theft&proximity=52.520008%2C13.404954&proximity_square=100' + _title)
            .then(function(response) {
                return response.json();
            }).catch(function (error){
                return error;
            })
         
    }
}
