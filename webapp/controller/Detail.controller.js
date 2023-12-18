sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     */
    function (Controller, JSONModel, MessageToast) {
        "use strict";
        //Constante ruta de navegación
        const NAVIGATION_PROP = "/NavReportToCost";
        return Controller.extend("ns.zpmorderreportapp.controller.Detail", { 
            onInit: function () {

                // Recibir la navegación a la vista y ejecutar el metodo que se recibe de la entidad OData
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("Detail").attachMatched(this._onRouteMatched, this);

            },
            // Metodo que recibe datos de la entidad del OData
            _onRouteMatched: async function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                oView = this.getView();
                var path = "/ZPM_Entity_ReportSet('" + oArgs.id.toString() + "')" + NAVIGATION_PROP;
                // Asignación de datos a modelo JSON para mostrar en la vista
                try {
                    let aCostos = await this.getCostos(path);
                    const oModelCostos = new JSONModel(aCostos);   
                    oView.setModel(oModelCostos, "Model");   
                } catch (err) {   
                    MessageToast.show("Error1", err);   
                }
            },

            // Metodo para recibir datos del OData
            getCostos: function (path) {
                let oModel = this.getView().getModel();
                return new Promise((resolve, reject) => {
                    oModel.read(path, {
                        success: function (oData) {
                            resolve(oData);
                        }.bind(this),
                        error: function (err) {
                            MessageToast.show("Error2", err);
                            reject(err);
                        }.bind(this)
                    });
                });
            },

        });
    });
