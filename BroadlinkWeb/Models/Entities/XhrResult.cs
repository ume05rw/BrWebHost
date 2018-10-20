using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BroadlinkWeb.Models.Entities
{
    [NotMapped]
    public class XhrResult
    {
        public static XhrResult CreateSucceeded()
        {
            var result = new XhrResult();
            result.Succeeded = true;
            return result;
        }

        public static XhrResult CreateSucceeded(object value)
        {
            var result = new XhrResult();
            result.Succeeded = true;
            result.Values = value;
            return result;
        }


        public static XhrResult CreateError(string message, string name = null)
        {
            var result = new XhrResult();
            result.Succeeded = false;
            result.Errors = new Error[]
            {
                new Error() { Message = message, Name = name }
            };
            return result;
        }

        public static XhrResult CreateError(IEnumerable<Error> errors)
        {
            var result = new XhrResult();
            result.Succeeded = false;
            result.Errors = errors.ToArray();
            return result;
        }

        public static XhrResult CreateError(ModelStateDictionary modelState)
        {
            var errors = new List<Error>();
            foreach (var pair in modelState)
                errors.AddRange(GetModelStateErrors(pair.Key, pair.Value));

            var result = new XhrResult();
            result.Succeeded = false;
            result.Errors = errors.ToArray();
            return result;
        }

        private static Error[] GetModelStateErrors(string name, ModelStateEntry msEnt)
        {
            var list = new List<Error>();

            foreach (var err in msEnt.Errors)
            {
                list.Add(new Error()
                {
                    Name = name,
                    Message = $"Message: {err.ErrorMessage}, Exception: {err.Exception.Message}, StuckTrace: {err.Exception.StackTrace}"
                });
            }

            foreach (var child in msEnt.Children)
                list.AddRange(GetModelStateErrors(name, child));

            return list.ToArray();
        }


        public object Values { get; set; } = null;

        public bool Succeeded { get; set; } = true;

        public Error[] Errors { get; set; } = new Error[] { };
    }

    // 特にジェネリック型を使う理由がないので、やめ。
    // 親クラスのプロパティ型を上書きすることは、可能らしい。
    //public class XhrResult<T>: XhrResult
    //{
    //    public static XhrResult CreateSucceeded(T value)
    //    {
    //        var result = new XhrResult<T>();
    //        result.Succeeded = true;
    //        result.Values = value;
    //        return result;
    //    }

    //    new public T Values { get; set; } = default(T);
    //}
}
