/*
 * Copyright 2016 Palantir Technologies, Inc. All rights reserved.
 * Licensed under the BSD-3 License as modified (the “License”); you may obtain a copy
 * of the license at https://github.com/palantir/blueprint/blob/master/LICENSE
 * and https://github.com/palantir/blueprint/blob/master/PATENTS
 */

import * as React from "react";

import { Intent } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

import { Column, ColumnHeaderCell, EditableCell, EditableName, Table } from "../src";

export interface ITableEditableExampleState {
    columnNames?: string[];
    sparseCellData?: { [key: string]: string };
    sparseCellIntent?: { [key: string]: Intent };
    sparseColumnIntents?: Intent[];
}

export class TableEditableExample extends BaseExample<ITableEditableExampleState> {
    public static dataKey = (rowIndex: number, columnIndex: number) => {
        return `${rowIndex}-${columnIndex}`;
    };

    public state: ITableEditableExampleState = {
        columnNames: ["Please", "Rename", "Me"],
        sparseCellData: {
            "1-1": "editable",
            "3-1": "validation 123",
        },
        sparseCellIntent: {
            "3-1": Intent.DANGER,
        },
        sparseColumnIntents: [],
    };

    public render() {
        const columns = this.state.columnNames.map((_: string, index: number) => {
            return <Column key={index} renderCell={this.renderCell} renderColumnHeader={this.renderColumnHeader} />;
        });
        return <Table numRows={7} useInteractionBar={true}>{columns}</Table>;
    }

    public renderCell = (rowIndex: number, columnIndex: number) => {
        const dataKey = TableEditableExample.dataKey(rowIndex, columnIndex);
        const value = this.state.sparseCellData[dataKey];
        return (
            <EditableCell
                value={value == null ? "" : value}
                intent={this.state.sparseCellIntent[dataKey]}
                onCancel={this.cellValidator(rowIndex, columnIndex)}
                onChange={this.cellValidator(rowIndex, columnIndex)}
                onConfirm={this.cellSetter(rowIndex, columnIndex)}
            />
        );
    };

    public renderColumnHeader = (columnIndex: number) => {
        const renderName = (name: string) => {
            return (
                <EditableName
                    name={name}
                    intent={this.state.sparseColumnIntents[columnIndex]}
                    onChange={this.nameValidator(columnIndex)}
                    onCancel={this.nameValidator(columnIndex)}
                    onConfirm={this.nameSetter(columnIndex)}
                />
            );
        };
        return (
            <ColumnHeaderCell
                name={this.state.columnNames[columnIndex]}
                renderName={renderName}
            />
        );
    };

    private isValidValue(value: string) {
        return /^[a-zA-Z]*$/.test(value);
    }

    private nameValidator = (index: number) => {
        return (name: string) => {
            const intent = this.isValidValue(name) ? null : Intent.DANGER;
            this.setArrayState("sparseColumnIntents", index, intent);
            this.setArrayState("columnNames", index, name);
        };
    };

    private nameSetter = (index: number) => {
        return (name: string) => {
            this.setArrayState("columnNames", index, name);
        };
    };

    private cellValidator = (rowIndex: number, columnIndex: number) => {
        const dataKey = TableEditableExample.dataKey(rowIndex, columnIndex);
        return (value: string) => {
            const intent = this.isValidValue(value) ? null : Intent.DANGER;
            this.setSparseState("sparseCellIntent", dataKey, intent);
            this.setSparseState("sparseCellData", dataKey, value);
        };
    };

    private cellSetter = (rowIndex: number, columnIndex: number) => {
        const dataKey = TableEditableExample.dataKey(rowIndex, columnIndex);
        return (value: string) => {
            const intent = this.isValidValue(value) ? null : Intent.DANGER;
            this.setSparseState("sparseCellData", dataKey, value);
            this.setSparseState("sparseCellIntent", dataKey, intent);
        };
    };

    private setArrayState<T>(key: string, index: number, value: T) {
        const values = (this.state as any)[key].slice() as T[];
        values[index] = value;
        this.setState({ [key]: values });
    }

    private setSparseState<T>(stateKey: string, dataKey: string, value: T) {
        const stateData = (this.state as any)[stateKey] as { [key: string]: T };
        const values = { ...stateData, [dataKey]: value };
        this.setState({ [stateKey]: values });
    }
}
