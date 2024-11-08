module default {

    type Foo {
        required total: int64;

        trigger update_after_update after update for each
        do (
            assert(true)
        );
    }

    type FooEntry {
        required foo: Foo;
        required value: int64;

        trigger update_foo after insert for each
        do (
            update __new__.foo
                set {
                    total := __new__.value
                }
        );
    }

}
