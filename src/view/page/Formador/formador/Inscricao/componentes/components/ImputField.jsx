import { FloatingLabel, Form } from "react-bootstrap";

const InputField = ({
    label,
    name,
    formik,
    type = "text",
    as = "input",
    options,
  }) => {
    if (!formik) return null; // evita crash
  
    const isInvalid = !!(formik.touched?.[name] && formik.errors?.[name]);
  
    return (
      <FloatingLabel label={label} className="mb-3">
        {as === "select" ? (
          <Form.Select
            name={name}
            value={formik.values[name] ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={isInvalid}
          >
            {options}
          </Form.Select>
        ) : (
          <Form.Control
            as={as}
            type={type}
            name={name}
            value={formik.values[name] ?? ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={isInvalid}
          />
        )}
  
        <Form.Control.Feedback type="invalid">
          {formik.errors?.[name]}
        </Form.Control.Feedback>
      </FloatingLabel>
    );
  };
  
  export default InputField;