'use strict';
import dayjs from 'dayjs'


function TitleFilter(array,bodyParameter)
{
        let newArr=array.filter(function (obj) {                                
        return obj.title.toLowerCase().includes(bodyParameter.toLowerCase());  
});
return newArr;
}


function ProfessorFilter(array,bodyParameter)
{
        let newArr=array.filter(function (obj) {
            let FullProfName=obj.teacher_name.toString()+" "+obj.teacher_surname.toString();
            return FullProfName.toLowerCase().includes(bodyParameter.toLowerCase()); 
});
return newArr;
}

function DateFilter(array,bodyParameter)
{
        let newArr=array.filter(function(obj) {
            return dayjs(bodyParameter).isBefore(dayjs(obj.expiration));
          });
return newArr;
}

function TypeFilter(array,bodyParameter)
{
        let newArr=array.filter(function (obj) {                                
            return obj.type.toLowerCase()==bodyParameter.toLowerCase();  
            // for this filter could be good in the frontend to select the type from predefined one
            //and not from writing in a text box
    }); 
return newArr;
}

function TagFilter(array,bodyParameter)
{
        let newArr=array.filter(function(obj) {
            //find and keep only the objects that have at least one keyword containing a specific search string.
            return obj.keywords.some(function(keyword) {
              return keyword.includes(bodyParameter);
            });
          });
return newArr;
}

function LevelFilter(array,bodyParameter)
{
        let newArr=array.filter(function (obj) {                                
            return obj.level==bodyParameter;  
            // for this filter could be good in the frontend to select the type from predefined one
            //and not from writing in a text box
    });
return newArr;
}

function GroupFilter(array,bodyParameter)
{
        let newArr=array.filter(function(obj) {
            //find and keep only the objects that have at least one group containing a specific search string.
            return obj.groups.some(function(keyword) {
              return keyword.includes(bodyParameter);
            });
          });
return newArr;
}

export {
    TitleFilter,
    ProfessorFilter,
    DateFilter,
    TypeFilter,
    TagFilter,
    LevelFilter,
    GroupFilter
}