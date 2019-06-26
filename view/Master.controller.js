jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.m.TablePersoController");
sap.ui.core.mvc.Controller.extend("sequeirablog.com.br.view.Master", {
	_oCatalog: null,
	_oResourceBundle: null,
	_ind: null,
	_countdowntime: null,
	_mylbl: null,
	onInit: function() {
		this._oView = this.getView();
		var oItemTemplate = this.byId("columnListItem").clone();
		this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
		this._oResourceBundle = this._oComponent.getModel("i18n").getResourceBundle();
		this._oRouter = this._oComponent.getRouter();
		this._oCatalog = this.byId("catalogTable");
		this._ind = this.byId("__indicator0");
		this._mylbl = this.byId("__label19");
		this._initViewPropertiesModel();
		this.update();
	},
	// The model created here is used to set values or view element properties that cannot be bound
	// directly to the OData service. Setting view element attributes by binding them to a model is preferable to the
	// alternative of getting each view element by its ID and setting the values directly because a JSon model is more
	// robust if the customer removes view elements (see extensibility).
	_initViewPropertiesModel: function() {
		var oViewElemProperties = {};
		oViewElemProperties.catalogTitleText = "ListSet";
		if (sap.ui.Device.system.phone) {
			oViewElemProperties.availabilityColumnWidth = "80%";
			oViewElemProperties.pictureColumnWidth = "5rem";
			oViewElemProperties.btnColHeaderVisible = true;
			oViewElemProperties.searchFieldWidth = "100%";
			oViewElemProperties.catalogTitleVisible = false;
			// in phone mode the spacer is removed in order to increase the size of the search field
			// this.byId("tableToolbar").removeContent(this.byId("toolbarSpacer"));
		} else {
			oViewElemProperties.availabilityColumnWidth = "18%";
			oViewElemProperties.pictureColumnWidth = "9%";
			oViewElemProperties.btnColHeaderVisible = false;
			oViewElemProperties.searchFieldWidth = "30%";
			oViewElemProperties.catalogTitleVisible = true;
		}
		this._oViewProperties = new sap.ui.model.json.JSONModel(oViewElemProperties);
		this._oView.setModel(this._oViewProperties, "viewProperties");
	},
	onNavBack: function() {
		window.history.go(-1);
	},
	// --- List Handling
	// Handler method for the table search.
	onSearchPressed: function() {
		var sValue = this.byId("searchField").getValue();
		var oFilter = new sap.ui.model.Filter("DocId", sap.ui.model.FilterOperator.Contains, sValue);
		var oBinding = this.byId("catalogTable").getBinding("items");
		oBinding.filter([oFilter]);
	},
	formatTime: function(time) {
		var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
			pattern: "HH:mm:ss"
		});
		var TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
		var timeStr = timeFormat.format(new Date(time.ms + TZOffsetMs));
		return timeStr;
	},
	formatDate: function(v) {
		if (v) {
			jQuery.sap.require("sap.ui.core.format.DateFormat");
			var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "dd/MM/YYYY"
			});
			return oDateFormat.format(new Date(v));
		}
	},
	update: function() {
		var that = this;
		var fiveMinutesLater = new Date();
		var scs = fiveMinutesLater.setMinutes(fiveMinutesLater.getMinutes() + 1);//1 minute...
		this._countdowntime = scs;
		//Update the table data...
		setInterval(function() {
			//Indicator...
			var now = new Date().getTime();
			var cTime = that._countdowntime - now;
			var minutes = Math.floor(cTime % (1000 * 60 * 60) / (1000 * 60));
			var seconds = Math.floor(cTime % (1000 * 60) / 1000);
			var totalSeconds = (minutes * 60) + seconds;
			var percentSeconds = 100 * totalSeconds / 60; //Here you could change your seconds...
			var newPercent = percentSeconds;
			if (minutes.toString().length == 1) {//If you want in minutes...
				minutes = "0" + minutes;
			}
			if (seconds.toString().length == 1) {
				seconds = "0" + seconds;
			}
			if (newPercent >= 0) {
				that._ind.setPercentValue(newPercent);
				//Change bar color to negative in last part...
				if (newPercent <= 25) {
					that._ind.setState("Error");
				} //Change bar color to critical in last last part...
				else if (newPercent <= 50) {
					that._ind.setState("Warning");
				}
			}
			that._mylbl.setText(minutes + ":" + seconds);
			if (newPercent <= 0) {
				fiveMinutesLater = new Date();
				scs = fiveMinutesLater.setMinutes(fiveMinutesLater.getMinutes() + 1);//Change here the minutes...
				that._countdowntime = scs;
				that._oCatalog.getModel().refresh(true);
				that._ind.setState("Success");
				that._ind.setPercentValue(100);
			}
		}, 1000);
	},
	// --- Navigation
	onLineItemPressed: function(oEvent) {
		this._oRouter.navTo("details", {
			from: "main",
			entity: oEvent.getSource().getBindingContext().getPath().substr(1),
			tab: null
		});
	},
	/**
	 *@memberOf sequeirablog.com.br.view.Master
	 */
	onrefresh: function() {
		//This code was generated by the layout editor.
		this._oCatalog.getModel().refresh(true);
	}
});