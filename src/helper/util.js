export function maskDateInput(input)
{
    var v = input;
    var value = v;
    if (v.match(/^\d{2}$/) !== null) {
      value = v + '/';
    } else if (v.match(/^\d{2}\/\d{2}$/) !== null) {
      value = v + '/';
    }

    return value;
}

export function getDateInMiliseconds (date){
  if(date.length == 10)
  {
    var dateSplit = date.split('/');
    var date = new Date(dateSplit[2],dateSplit[1] - 1,dateSplit[0]);
    return date.getTime();
  }else{
    return 0;
  }
}

export function formatDate(date){
  return date.getDate().toString().padStart(2, '0') + "/" + (date.getMonth() +1).toString().padStart(2, '0') + "/" + date.getFullYear()
   + " " + date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');
}