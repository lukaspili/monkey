module default {
    abstract constraint not_blank {
        errmessage := 'Cannot be blank: {__subject__}.';
        using (str_trim(__subject__) != '');
    }

    abstract constraint email {
        errmessage := 'Invalid email: {__subject__}.';
        using (re_test(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', __subject__));
    }
}
