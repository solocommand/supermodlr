<?php

trait Trait_Fieldstorage_Single {
    public function validate_storage($value = NULL) {
        //we don't know the data type here so scalar, arrays, and objects are all potentially valid.  Need to rely on the validate_datatype method
        return TRUE;

    }

    public function validate_datatype_values($value) {
        return $this->validate_datatype($value);
    }
}