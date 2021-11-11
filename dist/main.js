var mainApp = {};
var db;
(function(){
    var mainContainer = document.getElementById("main_container");
    var logtout =  function(){
        firebase.auth().signOut().then(function(){
          console.log('success');
          window.location.replace("login.html");
        },function(){})
    }

    async function getCurrentUser() {
      return new Promise((resolve, reject) => {
        fireBase.auth().onAuthStateChanged(user => {
          if (user) {
            resolve(user)
            console.log(user.displayName)

          }
        })
      })
    }


    var init = async function(){
      db = fireBase.firestore();
      const user = await getCurrentUser();
      console.log(user.uid)
      db.collection('stores').where('userId', '==', user.uid).onSnapshot((snapshot) => {
          snapshot.forEach(doc => {
            const tienda = doc.data();
            tienda.id = doc.id;
            const tabla = $('#storesTable').append()
            tabla.append(
              `<tr>
              <td>${tienda.Location}</td>
              <td>${tienda.Street}</td>
              <td>${tienda.Contacto}</td>
              <td><buttton id="${tienda.id}" class="btn btn-outline-primary btn-block">Puntos de Toma</button></td>
              </tr>
              `
            )

            $(`#${tienda.id}`).click(() => {
              getStoreTermometers(tienda.id)
            })
            
          })
        }
      )

          
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.
          console.log("stay");
          console.log(getCurrentUser().displayName);
          $('#UserInfo').append(              
            `
            <h5>${user.displayName}</h5>
            `
           )
          mainContainer.style.display = "";
        } else {
          // No user is signed in.
          mainContainer.style.display = "none";
          console.log("redirect");
          window.location.replace("login.html");
        }
      });


      var getStoreTermometers = (storeId) => {
       $('#HardwareInfo').removeAttr('hidden')
        db.collection('Termometos').where('Store', '==', storeId).onSnapshot((snapshot) => {
        $('#hardwareTable').empty()
          snapshot.forEach(doc => {
              const termometerAux = doc.data();
              termometerAux.id = doc.id;
              console.log(termometerAux.id)
              $('#hardwareTable').append(              
               `<tr>
                 <td>${termometerAux.loc}</td>
                 <td><buttton id="${termometerAux.id}" class="btn btn-outline-primary btn-block">Ver temperaturas</button></td>
               </tr>
               `
              )
              $(`#${termometerAux.id}`).click(() => {
                getStoreInfoHist(termometerAux.id)
              })
            })
          })
      }
      var getStoreInfo = (storeId) => {
        $('#storeInfo').removeAttr('hidden')
         db.collection('Termometos').where('id', '==', storeId).onSnapshot((snapshot) => {
         $('#termometroTable').empty()
           snapshot.forEach(doc => {
               doc = doc.data()
               $('#termometroTable').append(`
                 <tr>
                 <td>${new Date(doc.LastTemp.Date).toISOString()}</td>
                 <td>${doc.LastTemp.Temperature}</td>
                 </tr>
                 `
               )
             })
           })
       }
       var getStoreInfoHist = (storeId) => {
        $('#storeInfo').removeAttr('hidden')
         db.collection('Termometos').where('id', '==', storeId).get().then(querySnapshot=>{
          $('#termometroTable').empty()
          querySnapshot.forEach(function(doc) { 
            

            db.collection("Termometos").doc(doc.id).collection("bio").get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    const aux = doc.data()
                    console.log("aqui jorge")
                    console.log(doc.id, " => ", aux);
                    $('#termometroTable').append(`
                      <tr>
                      <td>${new Date(aux.Date).toISOString()}</td>
                      <td>${aux.Temp}</td>
                      </tr>
                      `
                    )
                });
            });



          const documentID = doc.id
          console.log("aqui", documentID)
          //  const subDoc = await db.collection('Termometos').where('id', '==', storeId)
          //  console.log(subDoc)
          //console.log("aqui", infohist)
         })
        //  $('#termometroTable').empty()
        //    snapshot.forEach(doc => {
        //        doc = doc.data()
        //        $('#termometroTable').append(`
        //          <tr>
        //          <td>${new Date(doc.LastTemp.Date).toISOString()}</td>
        //          <td>${doc.LastTemp.Temperature}</td>
        //          </tr>
        //          `
        //        )
        //      })
            })
       }
    }
    init();
    mainApp.logout = logtout;
})
();