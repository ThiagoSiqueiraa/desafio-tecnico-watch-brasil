drop schema if exists app;

create schema app;

create table app.users (
    id BIGSERIAL primary key,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    current_project_id BIGINT NULL REFERENCES app.projects(id),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp NULL
);

create table app.projects (
    id BIGSERIAL  primary key,
    name text NOT NULL,
    owner_user_id BIGINT NOT NULL REFERENCES app.users(id),
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp NULL
);

create table app.projects_members (
    project_id BIGINT NOT NULL REFERENCES app.projects(id),
    user_id BIGINT NOT NULL REFERENCES app.users(id),
    primary key (project_id, user_id)
);

create table app.tasks (
    id BIGSERIAL primary key,
    project_id BIGINT NOT NULL REFERENCES app.projects(id),
    title text NOT NULL,
    description text,
    status text NOT NULL,
    priority integer NOT NULL,
    due_date timestamp,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp NULL
);

create table app.tasks_members (
    task_id BIGINT NOT NULL REFERENCES app.tasks(id),
    user_id BIGINT NOT NULL REFERENCES app.users(id),
    primary key (task_id, user_id)
);


