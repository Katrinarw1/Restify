import React from "react";
import { useFieldArray } from "react-hook-form";
import Menu_subitem from "./nestedFieldArray";

let renderCount = 0;

export default function Fields({ control, register, setValue, getValues }) {
    const { fields, append, remove, prepend } = useFieldArray({
        control,
        name: "menu_item"
    });

    renderCount++;

    return (
        <>
            <ul>
                {fields.map((item, index) => {
                    return (
                        <div className="edit-item-box menu-item-content px-3 pb-3 pt-1" key={item.id}>
                            <div className="m-3 pt-2">
                                <div className="row mb-2 py-3">
                                    <label htmlFor="inputItem1" className="col-2 item-label col-form-label">
                                        Food item:
                                    </label>
                                    <div className="col-6">
                                        <input {...register(`menu_item[${index}].name`, { required: true })}
                                            defaultValue={item.name} id="inputItem1" className="form-control" />
                                    </div>

                                    <label htmlFor="inputItem1Price" className="col-2 price-label col-form-label">
                                        Price:
                                    </label>
                                    <div className="col">
                                        <input {...register(`menu_item[${index}].price`)} defaultValue={item.price}
                                            className="form-control" id="inputItem1Price" />
                                    </div>
                                </div>

                                <Menu_subitem nestIndex={index} {...{ control, register }} />

                                <div className="row my-5">
                                    <label htmlFor="inputSubItem2Descrip" className="col-2 descrip-label col-form-label">
                                        Description:
                                    </label>
                                    <div className="col">
                                        <textarea id="inputSubItem2Descrip" {...register(`menu_item[${index}].description`)}
                                            defaultValue={item.description} className="form-control"></textarea>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-danger" onClick={() => remove(index)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </ul>

            <section>
                <button type="button" className="btn btn-success mx-3" onClick={() => {
                    append({ name: "", price: "", description: "" });
                }} > + Add new item </button>

            </section>
        </>
    );
}
