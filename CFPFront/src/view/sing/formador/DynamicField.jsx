import { FloatingLabel, Form as BootstrapForm } from "react-bootstrap";

export default function DynamicField({
  form, type, name, label, options, largura, values, errors, touched, handleChange
}) {
  return (
    <div className={`w-${largura}`}>
      <FloatingLabel label={label} className="mb-4">
        {form === "Select" ? (
          <BootstrapForm.Select
            className="input_left_color p-2"
            name={name}
            value={values[name]}
            onChange={handleChange}
            isInvalid={touched[name] && !!errors[name]}
          >
            {options?.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </BootstrapForm.Select>
        ) : form === "Textarea" ? (
          <BootstrapForm.Control
            as="textarea"
            className="input_left_color p-2"
            name={name}
            value={values[name]}
            onChange={handleChange}
            isInvalid={touched[name] && !!errors[name]}
            placeholder={label}
            style={{ height: '100px' }}
            rows={9} // você pode ajustar o número de linhas
          />
        ) : (
          <BootstrapForm.Control
            className="input_left_color p-2"
            name={name}
            type={type}
            value={values[name]}
            onChange={handleChange}
            isInvalid={touched[name] && !!errors[name]}
            placeholder={label}
          />
        )}
        <BootstrapForm.Control.Feedback type="invalid">
          {errors[name]}
        </BootstrapForm.Control.Feedback>
      </FloatingLabel>
    </div>
  );
}
