const fs = require('fs');
const file = 'eduflow/app/login/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Email input
content = content.replace(
  '<Input\n                id="email"\n                type="email"\n                placeholder="m@example.com"\n                {...register("email")}\n                className={errors.email ? "border-risk" : ""}\n              />\n              {errors.email && <p className="text-sm text-risk">{errors.email.message}</p>}',
  `<Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email")}
                className={errors.email ? "border-risk" : ""}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && <p id="email-error" className="text-sm text-risk">{errors.email.message}</p>}`
);

// Password input
content = content.replace(
  '<Input\n                id="password"\n                type="password"\n                {...register("password")}\n                className={errors.password ? "border-risk" : ""}\n              />\n              {errors.password && <p className="text-sm text-risk">{errors.password.message}</p>}',
  `<Input
                id="password"
                type="password"
                {...register("password")}
                className={errors.password ? "border-risk" : ""}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && <p id="password-error" className="text-sm text-risk">{errors.password.message}</p>}`
);

fs.writeFileSync(file, content);
