sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/resource/ResourceModel",
    "sap/viz/ui5/format/ChartFormatter",
    "sap/viz/ui5/api/env/Format",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ResourceModel, ChartFormatter, Format, MessageToast, Filter, FilterOperator, JSONModel) {
        "use strict";

        return Controller.extend("ns.zpmorderreportapp.controller.ReportView", {
            onInit: function () {
                // Llamada a metodo que contiene el modelo que contiene los datos a mostrar
                this.ConsultaDatosGrafica("");
            },
            // Función de filtro de fechas en la gráfica
            onBtnFilter: function () {
                //obtener valores que el usuario ingresa en los input
                var startDate = this.byId("input1").getDateValue();
                var endDate = this.byId("input2").getDateValue();
                // Array vacio
                var aFilters = [];
                var filter;
                // Filtros 
                if (startDate && endDate) {
                  filter = new Filter("Erdat", FilterOperator.BT, startDate, endDate);
                } else if (startDate) {
                  filter = new Filter("Erdat", FilterOperator.EQ, startDate);
                } else if (endDate) {
                  filter = new Filter("Erdat", FilterOperator.EQ, endDate);
                }
                // Agregar array a variable
                aFilters.push(filter);
                // Llamada a metodo que contiene el modelo que contiene los datos con el array como parametro
                this.ConsultaDatosGrafica(aFilters);
            },

            // Función donde se obtienen los datos del OData
            ConsultaDatosGrafica: function (aFilter) {
                const i18nModel = new ResourceModel({
                    bundleName: "ns.zpmorderreportapp.i18n.i18n"
                });

                this.getView().setModel(i18nModel, "i18n");
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var oModel = this.getOwnerComponent().getModel();
                var counts = {};
                // Lectura de entidad del OData
                oModel.read("/ZPM_Entity_ReportSet", {
                    filters: aFilter,
                    success: function (oData, oResponse) {
                        if (oResponse.statusCode === "200") {
                            oData.results.forEach(function (oValue) {
                                // Logica para mostrar la gráfica
                                var partObj = oValue.PartObj;
                                if (counts[partObj]) {
                                    counts[partObj]++;
                                } else {
                                    counts[partObj] = 1;
                                }
                            });
                            var chartData = [];
                            for (var key in counts) {
                                chartData.push({
                                    PartObj: key,
                                    Count: counts[key]
                                });
                            }
                            // Propiedades de la gráfica 
                            let json = {
                                vizPropertiesColumn: {

                                    title: {
                                        text: oResourceBundle.getText("titulografica")
                                    },
                                    categoryAxis: {
                                        color: "black",
                                        axisLine: {
                                            size: 3,
                                            visible: true
                                        },
                                        axisTick: {
                                            shortTickVisible: true,
                                        },
                                    },
                                    plotArea: {
                                        colorPalette: "#72be40"
                                    }
                                },
                                graphData: {
                                    chartData
                                },
                                Data: {
                                    oData
                                }
                            };
                            var oGraphModel = new JSONModel(json);
                            this.getView().setModel(oGraphModel, "graphModel");
                        }
                    }.bind(this),
                    error: function (oError) {
                        MessageToast.show("Error al cargar los datos", oError);
                    }
                });

                let oPopOver = this.getView().byId("idPopover");

                // Desarrollo de gráfica de barras de columna  
                Format.numericFormatter(ChartFormatter.getInstance());
                let formatPattern = ChartFormatter.DefaultPattern;
                let oVizFrameColumn = this.getView().byId("idFrameColumn");
                oPopOver.connect(oVizFrameColumn.getVizUid());
                oPopOver.setFormatString(formatPattern.STANDARDFLOAT);

            },
            // Función para realizar la navegación y envío de Modelo JSON a vista Detalles
            ItemPress : function(oEvent){
                // Variable que permite obtener el registro seleccionado
                var oItem = oEvent.getSource().getBindingContext().getObject();   
                // Realizamos la navegación a la vista Detalles          
                this.getOwnerComponent().getRouter().navTo("Detail", {          
                    id: oItem.Aufnr        
                });
            }
        });
    });