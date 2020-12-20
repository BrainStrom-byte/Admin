import { firestore } from "../../firebase";


export const loadCategoryPage = (category,onSuccess,onError) =>{

    return (dispatch,getState)=>{

        firestore
        .collection("CATEGORIES")
        .doc(category)
        .collection('PROMOTION')
        .orderBy('Index')
        .get()
        .then((querySnapshot) => {
            let pagedata = []
         if(!querySnapshot.empty)
         {
            querySnapshot.forEach((doc) => {
                pagedata.push({id: doc.id,...doc.data()});
              });
              
         }
          dispatch({type : "LOAD_PAGE", payload: pagedata, category});  
         onSuccess();

    }).catch((error) =>{
        console.log(error);
        onError();

    });

  };
};

