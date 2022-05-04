import React from "react";
import { useFieldArray } from "react-hook-form";

export default ({ nestIndex, control, register }) => {
    const { fields, remove, append } = useFieldArray({
        control,
        name: `menu_item[${nestIndex}].menu_subitem`
    });

    return (
        <div>
            {fields.map((item, k) => {
                return (
                    <div className="row my-4 ps-4 ms-1 align-items-center" key={item.id}>
                        <label htmlFor="inputSubItem1" className="col sub-item-label col-form-label">Sub-item:</label>
                        <div className="col-2">
                            <input {...register(`menu_item[${nestIndex}].menu_subitem[${k}].name`, { required: true })}
                                defaultValue={item.name} className="form-control" id="inputSubItem1" />
                        </div>

                        <label htmlFor="inputSubItem1Price" className="col price-label col-form-label">Price:</label>
                        <div className="col">
                            <input {...register(`menu_item[${nestIndex}].menu_subitem[${k}].price`)}
                                defaultValue={item.price} className="form-control" id="inputSubItem1Price" />
                        </div>

                        <label htmlFor="inputSubItem1Descrip" className="col descrip-label col-form-label">
                            Description:
                        </label>
                        <div className="col-3">
                            <textarea {...register(`menu_item[${nestIndex}].menu_subitem[${k}].description`)}
                                defaultValue={item.description} className="form-control" id="inputSubItem1Descrip" rows="1">
                            </textarea>
                        </div>

                        <div className=" my-2 col-2">
                            <button type="button" className="btn btn-danger" onClick={() => remove(k)}>
                                delete sub-item
                            </button>
                        </div>
                    </div>

                );
            })}

            <button type="button" className="btn btn-success" onClick={() => append({
                name: "",
                price: "",
                description: ""
            })} > + Add new sub-item </button>

        </div>
    );
}