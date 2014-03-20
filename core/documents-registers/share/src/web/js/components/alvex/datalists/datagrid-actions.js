/**
 * Copyright (C) 2014 ITD Systems LLC.
 *
 * This file is part of Alvex
 *
 * Alvex is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alvex is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alvex. If not, see <http://www.gnu.org/licenses/>.
 */

// Ensure root object exists
if (typeof Alvex === "undefined" || !Alvex)
{
	var Alvex = {};
}

/**
 * Edit Data Item pop-up
 *
 * @method onActionEdit
 * @param item {object} Object literal representing one data item
 */
Alvex.DatagridItemEditAction = function(item)
{
	var scope = this;
	
	// Intercept before dialog show
	var doBeforeDialogShow = function DataGrid_onActionEdit_doBeforeDialogShow(p_form, p_dialog)
	{
		Alfresco.util.populateHTML(
			[ p_dialog.id + "-dialogTitle", this.msg("label.edit-row.title") ]
		);
	};
	
	var templateUrl = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT + "components/form?itemKind={itemKind}&itemId={itemId}&mode={mode}&submitType={submitType}&showCancelButton=true",
	{
		itemKind: "node",
		itemId: item.nodeRef,
		mode: "edit",
		submitType: "json"
	});
	
	// Using Forms Service, so always create new instance
	var editDetails = new Alvex.SimpleDialog(this.id + "-editDetails");
	editDetails.setOptions(
	{
		width: "50em",
		templateUrl: templateUrl,
		actionUrl: null,
		destroyOnHide: true,
		doBeforeDialogShow:
		{
			fn: doBeforeDialogShow,
			scope: this
		},
		onSuccess:
		{
			fn: function DataGrid_onActionEdit_success(response)
			{
				// Reload the node's metadata
				Alfresco.util.Ajax.jsonPost(
				{
					url: Alfresco.constants.PROXY_URI + "slingshot/datalists/item/node/" + new Alfresco.util.NodeRef(item.nodeRef).uri,
					dataObj: this._buildDataGridParams(),
					successCallback:
					{
						fn: function DataGrid_onActionEdit_refreshSuccess(response)
						{
							// Fire "itemUpdated" event
							YAHOO.Bubbling.fire("dataItemUpdated",
							{
								item: response.json.item
							});
							// Display success message
							Alfresco.util.PopupManager.displayMessage(
							{
								text: this.msg("message.details.success")
							});
						},
						scope: this
					},
					failureCallback:
					{
						fn: function DataGrid_onActionEdit_refreshFailure(response)
						{
							Alfresco.util.PopupManager.displayMessage(
							{
								text: this.msg("message.details.failure")
							});
						},
						scope: this
					}
				});
			},
			scope: this
		},
		onFailure:
		{
			fn: function DataGrid_onActionEdit_failure(response)
			{
				Alfresco.util.PopupManager.displayMessage(
				{
					text: this.msg("message.details.failure")
				});
			},
			scope: this
		}
	}).show();
};

/**
 * View Data Item pop-up
 * @method onActionView
 * @param item {object} Object literal representing one data item
 */
Alvex.DatagridItemViewAction = function(item)
{
	var scope = this;
	
	// Intercept before dialog show
	var doBeforeDialogShow = function(p_form, p_dialog)
	{
		Alfresco.util.populateHTML(
			[ p_dialog.id + "-dialogTitle", this.msg("label.view-row.title") ]
		);
	};
	
	var templateUrl = YAHOO.lang.substitute(Alfresco.constants.URL_SERVICECONTEXT + "components/form?itemKind={itemKind}&itemId={itemId}&mode={mode}&submitType={submitType}&showCancelButton=true",
	{
		itemKind: "node",
		itemId: item.nodeRef,
		mode: "view",
		submitType: "json"
	});
	
	// Using Forms Service, so always create new instance
	var viewDetails = new Alvex.SimpleDialog(this.id + "-viewDetails");
	viewDetails.setOptions(
	{
		width: "50em",
		templateUrl: templateUrl,
		actionUrl: null,
		destroyOnHide: true,
		formsServiceAvailable: false,
		doBeforeDialogShow:
		{
			fn: doBeforeDialogShow,
			scope: this
		}
	}).show();
};

// Just aliases for default actions for convenience

Alvex.DatagridItemDeleteAction = Alfresco.service.DataListActions.prototype.onActionDelete;

Alvex.DatagridItemDuplicateAction = Alfresco.service.DataListActions.prototype.onActionDuplicate;