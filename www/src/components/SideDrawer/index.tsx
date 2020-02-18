import React, { useState, useEffect } from "react";
import clsx from "clsx";
import _isEmpty from "lodash/isEmpty";

import { Drawer, Fab } from "@material-ui/core";
import ChevronIcon from "@material-ui/icons/KeyboardArrowDown";

import Form, { Field } from "./Form";

import { useStyles } from "./useStyles";
import { useSideDrawerContext } from "contexts/sideDrawerContext";
import { FieldType } from "constants/fields";

export const DRAWER_WIDTH = 600;
export const DRAWER_COLLAPSED_WIDTH = 36;

export default function SideDrawer() {
  const classes = useStyles();
  const { columns, selectedCell } = useSideDrawerContext();

  const [open, setOpen] = useState(false);
  const disabled = !selectedCell || _isEmpty(selectedCell.row);
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  // Map columns to form fields
  const fields = columns?.map(column => {
    const field: Field = {
      type: column.type,
      name: column.key,
      label: column.name,
    };

    switch (column.type) {
      case FieldType.longText:
        field.fieldVariant = "long";
        break;

      case FieldType.email:
        field.fieldVariant = "email";
        break;

      case FieldType.phone:
        field.fieldVariant = "phone";
        break;

      case FieldType.number:
        field.fieldVariant = "number";
        break;

      case FieldType.url:
        field.fieldVariant = "url";
        break;

      case FieldType.singleSelect:
      case FieldType.multiSelect:
        field.options = column.options;
        break;

      case FieldType.connectTable:
        field.collectionPath = column.collectionPath;
        field.config = column.config;
        break;

      default:
        break;
    }

    return field;
  });

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="right"
        className={classes.drawer}
        classes={{
          paperAnchorDockedRight: classes.paper,
          paper: clsx({
            [classes.paperOpen]: open,
            [classes.paperClose]: !open,
          }),
        }}
      >
        <div className={classes.drawerContents}>
          {fields && selectedCell && selectedCell.row && (
            <Form fields={fields} values={selectedCell.row} />
          )}
        </div>
      </Drawer>

      <div
        className={clsx(
          classes.drawerFabContainer,
          open && classes.drawerFabOpen
        )}
      >
        <Fab
          className={classes.drawerFab}
          classes={{ disabled: classes.drawerFabDisabled }}
          color="secondary"
          disabled={disabled}
          onClick={() => setOpen(o => !o)}
        >
          <ChevronIcon className={classes.drawerFabIcon} />
        </Fab>
      </div>
    </>
  );
}